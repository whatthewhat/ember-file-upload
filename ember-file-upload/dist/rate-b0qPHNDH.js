import { assert } from '@ember/debug';
import RSVP from 'rsvp';
import { waitForPromise } from '@ember/test-waiters';

function _applyDecoratedDescriptor(i, e, r, n, l) {
  var a = {};
  return Object.keys(n).forEach(function (i) {
    a[i] = n[i];
  }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = true), a = r.slice().reverse().reduce(function (r, n) {
    return n(i, e, r) || r;
  }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _initializerDefineProperty(e, i, r, l) {
  r && Object.defineProperty(e, i, {
    enumerable: r.enumerable,
    configurable: r.configurable,
    writable: r.writable,
    value: r.initializer ? r.initializer.call(l) : void 0
  });
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

function parseHeaders(headerString) {
  return headerString.split(/\n|\r/).filter(str => str !== '').reduce((headers, headerString) => {
    const parts = headerString.split(/^([0-9A-Za-z_-]*:)/);
    if (parts.length > 0 && parts[1] && parts[2]) {
      headers.append(parts[1].slice(0, -1), parts[2].trim());
    }
    return headers;
  }, new Headers());
}
function parseResponse(request) {
  const body = request.response === '' ? null : request.response;
  if (request.status >= 200 && request.status < 600) {
    return new Response(body, {
      status: request.status,
      statusText: request.statusText,
      headers: parseHeaders(request.getAllResponseHeaders())
    });
  } else {
    return Response.error();
  }
}
class HTTPRequest {
  constructor(options = {}) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _defineProperty(this, "onloadstart", void 0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _defineProperty(this, "onprogress", void 0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _defineProperty(this, "onloadend", void 0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _defineProperty(this, "ontimeout", void 0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    _defineProperty(this, "onabort", void 0);
    _defineProperty(this, "request", void 0);
    _defineProperty(this, "resolve", void 0);
    _defineProperty(this, "reject", void 0);
    _defineProperty(this, "promise", void 0);
    const {
      resolve,
      reject,
      promise
    } = RSVP.defer(`ember-file-upload: ${options.label}`);
    this.resolve = resolve;
    this.reject = reject;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.promise = promise;
    this.request = new XMLHttpRequest();
    this.request.withCredentials = options.withCredentials ?? false;
    let aborted;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    promise.cancel = () => {
      if (aborted == null) {
        aborted = RSVP.defer(`ember-file-upload: Abort ${options.label}`);
        this.request.abort();
      }
      return aborted.promise;
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    promise.then = function (...args) {
      const newPromise = RSVP.Promise.prototype.then.apply(this, args);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newPromise.cancel = promise.cancel;
      newPromise.then = promise.then;
      return newPromise;
    };
    this.request.onabort = () => {
      this.onabort?.();
      aborted.resolve();
    };
    this.request.onloadstart = evt => {
      this.onloadstart?.(evt);
    };
    this.request.onprogress = evt => {
      this.onprogress?.(evt);
    };
    this.request.onloadend = evt => {
      this.onloadend?.(evt);
    };
    if (this.request.upload) {
      this.request.upload.onloadstart = this.request.onloadstart;
      this.request.upload.onprogress = this.request.onprogress;
      this.request.upload.onloadend = this.request.onloadend;
    }
    this.request.onload = () => {
      const response = parseResponse(this.request);
      if (Math.floor(response.status / 200) === 1) {
        resolve(response);
      } else {
        reject(response);
      }
    };
    this.request.onerror = () => {
      reject(parseResponse(this.request));
    };
    Object.defineProperty(this, 'timeout', {
      get() {
        return this.request.timeout;
      },
      set(timeout) {
        this.request.timeout = timeout;
      },
      enumerable: true,
      configurable: false
    });
    this.request.ontimeout = () => {
      this.ontimeout?.();
      reject(parseResponse(this.request));
    };
  }
  send(body) {
    this.request.send(body);
    return this.promise;
  }
  open(method, url, _async, usename, password) {
    this.request.open(method, url, true, usename, password);
  }
  setRequestHeader(name, value) {
    this.request.setRequestHeader(name, value);
  }
}

/**
 * Possible file states.
 *
 * @remarks
 *
 * Here is the statechart describing the flow of state:
 *
 * ```
 *       .------.     .---------.     .--------.
 *   o--| queued |-->| uploading |-->| uploaded |
 *       `------`     `---------`     `--------`
 *          ^              |    .-------.
 *          |              |`->| aborted |
 *          |              |    `-------`
 *          |  .------.    |    .---------.
 *          `-| failed |<-` `->| timed_out |-.
 *          |  `------`         `---------`  |
 *          `-------------------------------`
 * ```
 */
let FileState = /*#__PURE__*/function (FileState) {
  FileState["Queued"] = "queued";
  FileState["Uploading"] = "uploading";
  FileState["TimedOut"] = "timed_out";
  FileState["Aborted"] = "aborted";
  FileState["Uploaded"] = "uploaded";
  FileState["Failed"] = "failed";
  return FileState;
}({});
let FileSource = /*#__PURE__*/function (FileSource) {
  /**
   * the file is created using the native file picker
   */
  FileSource["Browse"] = "browse";
  /**
   * the file was created using drag and drop from their desktop
   */
  FileSource["DragAndDrop"] = "drag-and-drop";
  /**
   * the file was created by dragging the file from another webpage
   */
  FileSource["Web"] = "web";
  /**
   * the file is created from a data URL using the `fromDataURL`
   * method for files. This usually means that the file was created
   * manually by the developer on behalf of the user
   */
  FileSource["DataUrl"] = "data-url";
  /**
   * the file is created from a blob using the `fromBlob`
   * method for files. This usually means that the file was created
   * manually by the developer
   */
  FileSource["Blob"] = "blob";
  return FileSource;
}({});

function clone(object) {
  return object ? {
    ...object
  } : {};
}
function normalizeOptions(file, url, options) {
  if (typeof url === 'object') {
    options = url;
    url = undefined;
  }
  options = clone(options);
  options.url = options.url || url;
  options.method = options.method || 'POST';
  options.accepts = options.accepts || ['application/json', 'text/javascript'];
  if (!Object.prototype.hasOwnProperty.call(options, 'contentType')) {
    options.contentType = file.type;
  }
  options.headers = clone(options.headers);
  options.data = clone(options.data);
  options.fileKey = options.fileKey || 'file';
  if (options.headers['Accept'] == null) {
    if (!Array.isArray(options.accepts)) {
      options.accepts = [options.accepts];
    }
    options.headers['Accept'] = options.accepts.join(',');
  }

  // Set Content-Type in the data payload
  // instead of the headers, since the header
  // for Content-Type will always be multipart/form-data
  if (options.contentType) {
    options.data['Content-Type'] = options.contentType;
  }
  options.data[options.fileKey] = file.file;
  options.withCredentials = options.withCredentials || false;
  return options;
}
function updateRate(file) {
  const updatedTime = new Date().getTime();

  // If there's a previous recording, we can calculate a rate from that
  if (file.timestampWhenProgressLastUpdated) {
    const timeElapsedSinceLastUpdate = updatedTime - file.timestampWhenProgressLastUpdated;
    const bytesTransferredSinceLastUpdate = file.loaded - file.bytesWhenProgressLastUpdated;

    // Divide by elapsed time to get bytes per millisecond
    const rate = bytesTransferredSinceLastUpdate / timeElapsedSinceLastUpdate;
    file.rates = [...file.rates, rate];
  }

  // Finally set current state to be picked up by next invocation
  file.bytesWhenProgressLastUpdated = file.loaded;
  file.timestampWhenProgressLastUpdated = updatedTime;
}
function onloadstart(file, event) {
  if (!event) return;
  if (!event.lengthComputable || event.total === 0) return;
  file.loaded = event.loaded;
  // It occurs that the event.total is not always correct.
  // For this reason we should hold the max file size.
  // The correct should be returned while progress
  file.size = Math.max(file.size, event.total);
  file.progress = file.loaded / file.size * 100;
  updateRate(file);
}
function onprogress(file, event) {
  if (!event) return;
  // We need to check also for isUploadComplete, because the browsers brings sometimes the onprogress after onloadend event
  if (!event.lengthComputable || event.total === 0 || file.isUploadComplete) return;
  file.size = event.total;

  // When the progress is completed there is possible that we get the `Content-Length` response header of the upload endpoint as loaded / total.
  // There is possible that `Content-Length` is lower or higher than the already loaded bytes.
  // if there is lower, we want to keep the higher loaded value, otherwise the progress percentage will be decreased
  // When the event.loaded is higher than the start file.size, we use the file.size, otherwise it can occur that progress for the file is higher than 100%
  let loaded = event.loaded;
  if (loaded > file.size) {
    loaded = file.size;
  }
  file.loaded = Math.max(loaded, file.loaded);
  file.progress = file.loaded / file.size * 100;
  updateRate(file);
}
function onloadend(file, event) {
  if (!event) return;
  if (!event.lengthComputable || event.total === 0) return;
  file.loaded = file.size;
  file.progress = file.loaded / file.size * 100;
  file.isUploadComplete = true;
}
function upload(file, url, opts, uploadFn) {
  if (['queued', 'failed', 'timed_out', 'aborted'].indexOf(file.state) === -1) {
    assert(`The file ${file.id} is in the state "${file.state}" and cannot be requeued.`);
  }
  const options = normalizeOptions(file, url, opts);
  const request = new HTTPRequest({
    withCredentials: options.withCredentials,
    label: `${options.method} ${file.name} to ${options.url}`
  });
  request.open(options.method ?? 'POST', options.url ?? '', true, '', '');

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Object.keys(options.headers).forEach(function (key) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.setRequestHeader(key, options.headers[key]);
  });
  if (options.timeout) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    request.timeout = options.timeout;
  }
  request.onloadstart = event => onloadstart(file, event);
  request.onprogress = event => onprogress(file, event);
  request.onloadend = event => onloadend(file, event);
  request.ontimeout = () => {
    file.state = FileState.TimedOut;
    file.queue?.flush();
  };
  request.onabort = () => {
    file.state = FileState.Aborted;
    file.queue?.flush();
  };
  file.state = FileState.Uploading;
  return waitForPromise(uploadFn(request, options).then(function (response) {
    file.state = FileState.Uploaded;
    file.queue?.uploadSucceeded(file, response);
    return response;
  }).catch(function (response) {
    file.state = FileState.Failed;
    file.queue?.uploadFailed(file, response);
    return Promise.reject(response);
  }).finally(() => file.queue?.flush()));
}

/**
  Provides a promise-aware interface for reading files.

  ```js
  import { UploadFile, UploadFileReader } from 'ember-file-upload';

  let reader = new UploadFileReader();
  let file = File.fromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAAXNSR0IArs4c6QAAACNJREFUCB1jYICC6dOn/4exwTRMAEYzwBnoOmASMBpuDLIAAIVVFiE0cg0oAAAAAElFTkSuQmCC');

  reader.readAsDataURL(file.blob).then((url) => {
    return url;
  }, function (err) {
    console.error(err);
  });
  ```

  Promises can be aborted, which will cancel the file upload:

  ```js
  let promise = reader.readAsDataURL(file.blob);
  promise.then((url) => {
    return url;
  }, (err) => {
    console.error(err);
  });

  promise.abort().then(() => {
    console.error('cancelled reading file');
  });
  ```

  @class UploadFileReader
  @constructor
  @param [options] An object with a label to use to mark the promise.
 */
class UploadFileReader {
  constructor(options = {
    label: ''
  }) {
    _defineProperty(this, "label", void 0);
    _defineProperty(this, "reader", void 0);
    this.label = options.label;
    this.reader = new FileReader();
  }

  /**
    Reads the file and returns a promise that will
    return the blob as ArrayBuffer.
     @method readAsArrayBuffer
    @return {Promise} A promise that will return the file as an ArrayBuffer
   */
  readAsArrayBuffer(blob) {
    this.reader.readAsArrayBuffer(blob);
    return this.cancellablePromise;
  }

  /**
    Reads the file and returns a promise that will
    return the blob as data URL.
     This is useful for reading images to display
    as a preview in the browser.
     @method readAsDataURL
    @return {Promise} A promise that will return the file as a data URL
   */
  readAsDataURL(blob) {
    this.reader.readAsDataURL(blob);
    return this.cancellablePromise;
  }

  /**
    Reads the file and returns a promise that will
    return the blob as binary string.
     This is useful for reading images or files that
    are not plain text.
     @method readAsBinaryString
    @return {Promise} A promise that will return the file as a binary string
   */
  readAsBinaryString(blob) {
    this.reader.readAsBinaryString(blob);
    return this.cancellablePromise;
  }

  /**
    Reads the file and returns a promise that will
    return the blob as text.
     This is useful for reading plain text files.
     @method readAsText
    @return {Promise} A promise that will return the file as text
   */
  readAsText(blob) {
    this.reader.readAsText(blob);
    return this.cancellablePromise;
  }
  get cancellablePromise() {
    const {
      promise,
      resolve,
      reject
    } = RSVP.defer(`ember-file-upload: ${this.label}`);
    const cancellable = promise.then(() => {
      return this.reader.result;
    }, () => {
      return RSVP.reject(this.reader.error);
    }, `ember-file-upload: Unpack ${this.label}`);
    let abort;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cancellable.cancel = () => {
      if (abort == null) {
        abort = RSVP.defer(`ember-file-upload: Abort ${this.label}`);
        this.reader.abort();
      }
      return abort.promise;
    };
    this.reader.onload = resolve;
    this.reader.onerror = reject;
    this.reader.onabort = () => {
      abort?.resolve();
    };
    return cancellable;
  }
}

// Calculate from the last x rate recordings
const CALCULATE_FROM_LAST = 30;

// Weigh recent rates more highly
const THRESHOLDS = [{
  threshold: 10,
  proportion: 3
}, {
  threshold: 20,
  proportion: 2
}, {
  threshold: 30,
  proportion: 1
}];
const DEFAULT_PROPORTION = 1;
function estimatedRate(allRates) {
  if (!allRates.length) return 0;
  const rates = allRates.slice(CALCULATE_FROM_LAST * -1).reverse();
  const weights = generateWeights(rates.length);

  // Multiply each rate by its respective weight for a weighted average
  return rates.reduce((acc, rate, index) => {
    const weight = weights[index];
    return acc + rate * weight;
  }, 0);
}
function generateWeights(totalRates) {
  // Generate an array the same length as totalRates filled with proportioanl weights
  const proportions = Array.from({
    length: totalRates
  }).map((_, index) => {
    return proportionForPosition(index + 1);
  });
  const proportionTotal = proportions.reduce((acc, value) => acc + value, 0);
  // Convert proportional weights to real weights by division
  const realWeights = proportions.map(proportion => proportion / proportionTotal);
  return realWeights;
}
function proportionForPosition(position) {
  for (const {
    threshold,
    proportion
  } of THRESHOLDS) {
    if (position <= threshold) return proportion;
  }
  return DEFAULT_PROPORTION;
}

export { FileSource as F, HTTPRequest as H, UploadFileReader as U, _applyDecoratedDescriptor as _, _defineProperty as a, _initializerDefineProperty as b, FileState as c, onloadstart as d, estimatedRate as e, onprogress as f, generateWeights as g, _classPrivateFieldInitSpec as h, _classPrivateFieldSet2 as i, _classPrivateFieldGet2 as j, onloadend as o, proportionForPosition as p, upload as u };
//# sourceMappingURL=rate-b0qPHNDH.js.map
