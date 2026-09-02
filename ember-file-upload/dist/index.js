export { D as DEFAULT_QUEUE, F as FileQueueService, Q as Queue, U as UploadFile } from './file-queue-ss35Q-nz.js';
import { U as UploadFileReader } from './rate-b0qPHNDH.js';
export { F as FileSource, c as FileState } from './rate-b0qPHNDH.js';
import { assert } from '@ember/debug';
import { macroCondition, dependencySatisfies, importSync } from '@embroider/macros';

function extractFormData(formData) {
  let data = {};
  let file = null;
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      file = {
        key,
        value
      };
      continue;
    }
    data = {
      ...data,
      [key]: value
    };
  }
  assert('Failed find a file in request body', file?.key && file?.value);
  return {
    file,
    data
  };
}
const pipelines = {
  async gif(file) {
    const buffer = await new UploadFileReader().readAsArrayBuffer(file);
    const data = new Uint8Array(buffer);
    let duration = 0;
    for (let i = 0; i < data.length; i++) {
      const byte4 = data[i + 4];
      const byte5 = data[i + 5];

      // Find a Graphic Control Extension hex(21F904__ ____ __00)
      if (data[i] === 0x21 && data[i + 1] === 0xf9 && data[i + 2] === 0x04 && byte4 !== undefined && byte5 !== undefined && data[i + 7] === 0x00) {
        // Swap 5th and 6th bytes to get the delay per frame
        const delay = byte5 << 8 | byte4 & 0xff;

        // Should be aware browsers have a minimum frame delay
        // e.g. 6ms for IE, 2ms modern browsers (50fps)
        duration += delay < 2 ? 10 : delay;
      }
    }
    return {
      hasAdditionalMetadata: true,
      duration: duration / 1000,
      animated: duration > 0
    };
  },
  image(_file, metadata) {
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = () => resolve({
        hasAdditionalMetadata: true,
        img
      });
      img.onerror = () => resolve({
        hasAdditionalMetadata: false
      });
      img.src = metadata.url;
    }).then(function ({
      hasAdditionalMetadata,
      img
    }) {
      return {
        hasAdditionalMetadata,
        width: img?.naturalWidth,
        height: img?.naturalHeight
      };
    });
  },
  video(_file, metadata) {
    const videoEl = document.createElement('video');
    return new Promise(function (resolve) {
      videoEl.addEventListener('loadeddata', () => resolve({
        hasAdditionalMetadata: true,
        video: videoEl
      }));
      videoEl.onerror = () => resolve({
        hasAdditionalMetadata: false
      });
      videoEl.src = metadata.url;
      document.body.appendChild(videoEl);
      videoEl.load();
    }).then(function ({
      hasAdditionalMetadata,
      video
    }) {
      return {
        hasAdditionalMetadata,
        duration: video?.duration,
        width: video?.videoWidth,
        height: video?.videoHeight
      };
    }).finally(function () {
      document.body.removeChild(videoEl);
    });
  },
  audio(_file, metadata) {
    const audioEl = document.createElement('audio');
    return new Promise(function (resolve) {
      audioEl.addEventListener('loadeddata', () => resolve({
        hasAdditionalMetadata: true,
        audio: audioEl
      }));
      audioEl.onerror = () => resolve({
        hasAdditionalMetadata: false
      });
      audioEl.src = metadata.url;
      document.body.appendChild(audioEl);
      audioEl.load();
    }).then(function ({
      hasAdditionalMetadata,
      audio
    }) {
      return {
        hasAdditionalMetadata,
        duration: audio?.duration
      };
    }).finally(function () {
      document.body.removeChild(audioEl);
    });
  }
};
async function extractFileMetadata(file) {
  const url = await new UploadFileReader().readAsDataURL(file);
  const metadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    extension: (file.name.match(/\.(.*)$/) ?? [])[1],
    url
  };
  const metadataPipelines = [];
  if (metadata.type === 'image/gif') {
    metadataPipelines.push(pipelines.gif(file));
  }
  if (metadata.type.match(/^image\//)) {
    metadataPipelines.push(pipelines.image(file, metadata));
  }
  if (metadata.type.match(/^video\//)) {
    metadataPipelines.push(pipelines.video(file, metadata));
  }
  if (metadata.type.match(/^audio\//)) {
    metadataPipelines.push(pipelines.audio(file, metadata));
  }
  const additionalMetadata = await Promise.all(metadataPipelines);
  additionalMetadata.forEach(function (data) {
    Object.assign(metadata, data);
  });

  // Collapse state of `hasAdditionalMetadata` from multiple pipelines
  // Should be `true` if at least one pipeline succeeded
  metadata.hasAdditionalMetadata = additionalMetadata.some(data => data.hasAdditionalMetadata);
  return metadata;
}

const NETWORK = {
  wired: 50000,
  // 500 Mb/s
  wifi: 15000,
  // 15 Mb/s
  dsl: 1000,
  // 1 Mb/s
  '4g': 3000,
  // 4 Mb/s
  '3g': 250,
  // 250 kb/s
  '2g': 50,
  // 50 kb/s
  gprs: 20,
  // 20 kb/s
  offline: 0
};
function uploadHandler(fn, options = {
  network: null,
  timeout: null
}) {
  if (macroCondition(dependencySatisfies('miragejs', '*'))) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {
      Response
    } = importSync('miragejs');
    return function (db, request) {
      let speed = Infinity;
      if (options.network && NETWORK[options.network]) {
        speed = NETWORK[options.network] * 1024;
      }
      const {
        file,
        data
      } = extractFormData(request.requestBody);
      let loaded = 0;
      const total = file.value.size;
      return new Promise(resolve => {
        const start = new Date().getTime();
        request.upload.onloadstart(new ProgressEvent('loadstart', {
          lengthComputable: true,
          total,
          loaded: Math.min(loaded, total)
        }));
        const upload = async () => {
          const timedOut = options.timeout && new Date().getTime() - start > options.timeout;
          if (timedOut || loaded >= total) {
            request.upload.onloadend(new ProgressEvent('loadend', {
              lengthComputable: true,
              // For the loadend event the `total` value may be sourced from the `Content-Length` response header of the upload endpoint.
              // In which case it may represent the size of the response rather than the number of uploaded bytes.
              // So we set it to an arbitrary value to make sure this doesn't influence file upload and queue progress stats.
              // See: https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent/total
              total: 300,
              loaded: Math.min(loaded, total)
            }));
            const metadata = await extractFileMetadata(file.value);
            request.requestBody = {
              [file.key]: metadata,
              ...data
            };
            if (timedOut) {
              resolve(new Response(408));
              return;
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            resolve(fn.call(this, db, request));
          } else {
            request.upload.onprogress(new ProgressEvent('progress', {
              lengthComputable: true,
              total,
              loaded
            }));
            loaded += speed / 20;
            setTimeout(upload, 50);
          }
        };
        upload();
      });
    };
  } else {
    throw new Error('You must add miragejs to your app to use this helper.');
  }
}

export { uploadHandler };
//# sourceMappingURL=index.js.map
