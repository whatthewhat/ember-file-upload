import { _ as _applyDecoratedDescriptor, a as _defineProperty, h as _classPrivateFieldInitSpec, b as _initializerDefineProperty, i as _classPrivateFieldSet2, j as _classPrivateFieldGet2, e as estimatedRate, u as upload, U as UploadFileReader, F as FileSource, c as FileState } from './rate-b0qPHNDH.js';
import { assert } from '@ember/debug';
import s__default from '@ember/service';
import { registerDestructor } from '@ember/destroyable';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { TrackedSet, TrackedMap } from 'tracked-built-ins';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';

var _class$1, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _source, _relativePath, _id, _name$1, _size;

/**
 * Files provide a uniform interface for interacting
 * with data that can be uploaded or read.
 */
let UploadFile = (_class$1 = (_source = /*#__PURE__*/new WeakMap(), _relativePath = /*#__PURE__*/new WeakMap(), _id = /*#__PURE__*/new WeakMap(), _name$1 = /*#__PURE__*/new WeakMap(), _size = /*#__PURE__*/new WeakMap(), class UploadFile {
  constructor(file, source, relativePath) {
    _defineProperty(this, "file", void 0);
    _classPrivateFieldInitSpec(this, _source, void 0);
    _classPrivateFieldInitSpec(this, _relativePath, void 0);
    _defineProperty(this, "queue", void 0);
    _classPrivateFieldInitSpec(this, _id, `file-${guidFor(this)}`);
    _classPrivateFieldInitSpec(this, _name$1, void 0);
    _classPrivateFieldInitSpec(this, _size, 0);
    /**
     * Tracks the number of bytes that had been uploaded when progress values last changed.
     */
    _defineProperty(this, "bytesWhenProgressLastUpdated", 0);
    /** The number of bytes that have been uploaded to the server */
    _initializerDefineProperty(this, "loaded", _descriptor, this);
    /**
     * The current progress of the upload, as a percentage in the
     * range of 0 to 100.
     */
    _initializerDefineProperty(this, "progress", _descriptor2, this);
    /**
     * When upload has finished this property will be set to true
     */
    _initializerDefineProperty(this, "isUploadComplete", _descriptor3, this);
    /**
     * The current state that the file is in.
     */
    _initializerDefineProperty(this, "state", _descriptor4, this);
    // /**
    //   The source of the file. This is useful
    //   for applications that want to gather
    //   analytics about how users upload their
    //   content.
    //   This property can be one of the following:
    //   - `browse`
    //   - `drag-and-drop`
    //   - `web`
    //   - `data-url`
    //   - `blob`
    //   `browse` is the source when the file is created
    //   using the native file picker.
    //   `drag-and-drop` is the source when the file was
    //   created using drag and drop from their desktop.
    //   `web` is the source when the file was created
    //   by dragging the file from another webpage.
    //   `data-url` is the source when the file is created
    //   from a data URL using the `fromDataURL` method for
    //   files. This usually means that the file was created
    //   manually by the developer on behalf of the user.
    //   `blob` is the source when the file is created
    //   from a blob using the `fromBlob` method for
    //   files. This usually means that the file was created
    //   manually by the developer.
    //   @accessor source
    //   @type {String}
    //   @default ''
    //   @readonly
    //  */
    // source?: FileSource;
    /**
     * The timestamp of when the progress last updated in milliseconds. Used to calculate the time
     * that has elapsed.
     */
    _defineProperty(this, "timestampWhenProgressLastUpdated", 0);
    _initializerDefineProperty(this, "rates", _descriptor5, this);
    this.file = file;
    _classPrivateFieldSet2(_source, this, source);
    _classPrivateFieldSet2(_relativePath, this, relativePath);
  }

  /**
   * Path of the file relative to the directory it was added from,
   * including the directory name itself and the file name —
   * e.g. `reports/q3/deck.pdf`.
   *
   * Populated when a directory is dropped on a `FileDropzone` with
   * `@allowFolderDrop={{true}}`, or when files are selected via an input
   * with the `webkitdirectory` attribute (via `File.webkitRelativePath`).
   *
   * Empty string when the file was not added as part of a directory.
   * An explicitly supplied path (including an empty one) always takes
   * precedence over `File.webkitRelativePath`.
   */
  get relativePath() {
    return _classPrivateFieldGet2(_relativePath, this) ?? this.file.webkitRelativePath ?? '';
  }

  /**
   * The source of the file. This is useful
   * for applications that want to gather
   * analytics about how users upload their
   * content.
   */
  get source() {
    return _classPrivateFieldGet2(_source, this);
  }
  /** A unique id generated for this file. */
  get id() {
    return _classPrivateFieldGet2(_id, this);
  }
  /** The file name */
  get name() {
    return _classPrivateFieldGet2(_name$1, this) ?? this.file?.name;
  }
  set name(value) {
    _classPrivateFieldSet2(_name$1, this, value);
  }

  /** The current speed in ms that it takes to upload one byte */
  get rate() {
    return estimatedRate(this.rates);
  }
  /** The size of the file in bytes. */
  get size() {
    return _classPrivateFieldGet2(_size, this) || this.file.size;
  }
  set size(value) {
    _classPrivateFieldSet2(_size, this, value);
  }

  /**
   * The MIME type of the file.
   *
   * For a image file this may be `image/png`.
   */
  get type() {
    return this.file.type;
  }

  /**
   * Returns the appropriate file extension of
   * the file according to the type
   */
  get extension() {
    return this.type.split('/').slice(-1)[0] ?? '';
  }
  /**
   * Upload file with `application/octet-stream` content type.
   *
   * @param url Your server endpoint where to upload the file
   * @param options additional request options
   */
  uploadBinary(url, options) {
    options.contentType = 'application/octet-stream';
    return upload(this, url, options, request => {
      this.queue?.uploadStarted(this);
      return request.send(this.file);
    });
  }

  /**
   * Upload file to your server
   *
   * @param url Your server endpoint where to upload the file
   * @param options additional options, eg. `{ fileKey: string, data: { key: string } }`
   */
  upload(url, options) {
    return upload(this, url, options, (request, opts) => {
      // Build the form
      const form = new FormData();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      for (const key of Object.keys(opts.data)) {
        if (key === opts.fileKey) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          form.append(key, opts.data[key], this.name);
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          form.append(key, opts.data[key]);
        }
      }
      this.queue?.uploadStarted(this);
      return request.send(form);
    });
  }

  /**
   * Resolves with Blob as ArrayBuffer
   */
  readAsArrayBuffer() {
    const reader = new UploadFileReader({
      label: `Read ${this.name} as an ArrayBuffer`
    });
    return reader.readAsArrayBuffer(this.file);
  }

  /**
   * Resolves with Blob as DataURL
   */
  readAsDataURL() {
    const reader = new UploadFileReader({
      label: `Read ${this.name} as a Data URI`
    });
    return reader.readAsDataURL(this.file);
  }

  /**
   * Resolves with Blob as binary string
   */
  readAsBinaryString() {
    const reader = new UploadFileReader({
      label: `Read ${this.name} as a binary string`
    });
    return reader.readAsBinaryString(this.file);
  }

  /**
   * Resolves with Blob as plain text
   */
  readAsText() {
    const reader = new UploadFileReader({
      label: `Read ${this.name} as text`
    });
    return reader.readAsText(this.file);
  }

  /**
   * Creates a file object that can be read or uploaded to a
   * server from a Blob object.
   *
   * @param blob the blob to create the file from.
   * @param source the source that created the blob.
   * @returns the file
   */
  static fromBlob(blob, source = FileSource.Blob) {
    const file = new File([blob], 'blob', {
      type: blob.type
    });
    return new this(file, source);
  }

  /**
   * Creates a file object that can be read or uploaded to a
   * server from a data URL.
   *
   * @param dataURL the data URL to create the file from.
   * @param source the source of the data URL.
   * @returns the file
   */
  static fromDataURL(dataURL, source = FileSource.DataUrl) {
    const [typeInfo, base64String] = dataURL.split(',');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mimeType = typeInfo.match(/:(.*?);/)[1];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const binaryString = atob(base64String);
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0, len = binaryString.length; i < len; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([binaryData], {
      type: mimeType
    });
    return this.fromBlob(blob, source);
  }
}), _descriptor = _applyDecoratedDescriptor(_class$1.prototype, "loaded", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class$1.prototype, "progress", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return 0;
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class$1.prototype, "isUploadComplete", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return false;
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class$1.prototype, "state", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return FileState.Queued;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class$1.prototype, "rates", [tracked], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return [];
  }
}), _class$1);

var _class, _listeners, _name, _distinctFiles;

/**
 * The Queue is a collection of files that
 * are being manipulated by the user.
 *
 * Queues are designed to persist the state
 * of uploads when a user navigates around your
 * application.
 */
let Queue = (_class = (_listeners = /*#__PURE__*/new WeakMap(), _name = /*#__PURE__*/new WeakMap(), _distinctFiles = /*#__PURE__*/new WeakMap(), class Queue {
  /**
   * The unique identifier of the queue.
   *
   * @remarks
   * Queue names should be deterministic so they
   * can be retrieved. It's recommended to provide
   * a helpful name.
   *
   * If the queue belongs to a top level collection,
   * photos, the good name for this queue may be `"photos"`.
   *
   * If you're uploading images to an artwork, the
   * best name would incoporate both `"artworks"` and
   * the identifier of the artwork. A good name for this
   * queue may be `"artworks/{{id}}/photos"`, where `{{id}}`
   * is a dynamic segment that is generated from the artwork id.
   */
  get name() {
    return _classPrivateFieldGet2(_name, this);
  }

  /** The FileQueue service. */

  /**
   * The list of files in the queue. This automatically gets
   * flushed when all the files in the queue have settled.
   *
   * @remarks
   * Note that files that have failed need to be manually
   * removed from the queue. This is so they can be retried
   * without resetting the state of the queue, orphaning the
   * file from its queue. Upload failures can happen due to a
   * timeout or a server response. If you choose to use the
   * `abort` method, the file will fail to upload, but will
   * be removed from the requeuing proccess, and will be
   * considered to be in a settled state.
   *
   * @defaultValue []
   */
  get files() {
    return [..._classPrivateFieldGet2(_distinctFiles, this).values()];
  }

  /**
   * The current time in ms it is taking to upload 1 byte.
   *
   * @defaultValue 0
   */
  get rate() {
    return this.files.filter(file => file.state === FileState.Uploading).reduce((acc, {
      rate
    }) => {
      return acc + rate;
    }, 0);
  }

  /**
   * The total size of all files currently being uploaded in bytes.
   *
   * @defaultValue 0
   */
  get size() {
    return this.files.reduce((acc, {
      size
    }) => {
      return acc + size;
    }, 0);
  }

  /**
   * The number of bytes that have been uploaded to the server.
   *
   * @defaultValue 0
   */
  get loaded() {
    return this.files.reduce((acc, {
      loaded
    }) => {
      return acc + loaded;
    }, 0);
  }

  /**
   * The current progress of all uploads, as a percentage in the
   * range of 0 to 100.
   *
   * @defaultValue 0
   */
  get progress() {
    const percent = this.loaded / this.size || 0;
    return Math.floor(percent * 100);
  }
  constructor({
    name,
    fileQueue
  }) {
    _classPrivateFieldInitSpec(this, _listeners, new Set());
    _classPrivateFieldInitSpec(this, _name, void 0);
    _defineProperty(this, "fileQueue", void 0);
    _classPrivateFieldInitSpec(this, _distinctFiles, new TrackedSet());
    _defineProperty(this, "selectFile", modifier((element, _positional, {
      filter,
      onFilesSelected
    }) => {
      const changeHandler = event => {
        const {
          files: fileList
        } = event.target;
        if (!fileList) {
          return;
        }
        const files = Array.from(fileList);
        const selectedFiles = [];
        for (const file of files) {
          // Populated by the browser for inputs with the `webkitdirectory`
          // attribute, empty otherwise
          const relativePath = file.webkitRelativePath ?? '';
          if (filter && !filter(file, files, files.indexOf(file), relativePath)) {
            continue;
          }
          let uploadFile;
          if (file instanceof File) {
            uploadFile = new UploadFile(file, FileSource.Browse);
          }
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          else if (file instanceof Blob) {
            uploadFile = UploadFile.fromBlob(file, FileSource.Browse);
          }
          if (uploadFile) {
            selectedFiles.push(uploadFile);
            this.add(uploadFile);
          }
        }
        onFilesSelected?.(selectedFiles);

        // this will reset the input, so the _same_ file can be picked again
        // Without, the `change` event wouldn't be fired, as it is still the same
        // value
        element.value = '';
      };
      element.addEventListener('change', changeHandler);
      return () => {
        element.removeEventListener('change', changeHandler);
      };
    },
    // used to opt-in to lazy argument handling, which is the default for ember-modifier@^4
    {
      eager: false
    }));
    _classPrivateFieldSet2(_name, this, name);
    this.fileQueue = fileQueue;
  }
  addListener(listener) {
    _classPrivateFieldGet2(_listeners, this).add(listener);
  }
  removeListener(listener) {
    _classPrivateFieldGet2(_listeners, this).delete(listener);
  }

  /**
   * Add a file to the queue
   * @param file the file to be added
   */
  add(file) {
    if (_classPrivateFieldGet2(_distinctFiles, this).has(file)) {
      return;
    }
    file.queue = this;
    _classPrivateFieldGet2(_distinctFiles, this).add(file);
    for (const listener of _classPrivateFieldGet2(_listeners, this)) {
      listener.onFileAdded?.(file);
    }
  }

  /**
   * Remove a file from the queue
   * @param file the file to be removed
   */
  remove(file) {
    if (!_classPrivateFieldGet2(_distinctFiles, this).has(file)) {
      return;
    }
    file.queue = undefined;
    _classPrivateFieldGet2(_distinctFiles, this).delete(file);
    for (const listener of _classPrivateFieldGet2(_listeners, this)) {
      listener.onFileRemoved?.(file);
    }
  }
  uploadStarted(file) {
    for (const listener of _classPrivateFieldGet2(_listeners, this)) {
      listener.onUploadStarted?.(file);
    }
  }
  uploadSucceeded(file, response) {
    for (const listener of _classPrivateFieldGet2(_listeners, this)) {
      listener.onUploadSucceeded?.(file, response);
    }
  }
  uploadFailed(file, response) {
    for (const listener of _classPrivateFieldGet2(_listeners, this)) {
      listener.onUploadFailed?.(file, response);
    }
  }

  /**
   * Flushes the `files` property if they have settled. This
   * will only flush files when all files have arrived at a terminus
   * of their state chart (`uploaded` and `aborted`).
   *
   * Files *may* be requeued by the user in the `failed` or `timed_out`
   * states.
   */
  flush() {
    if (this.files.length === 0) {
      return;
    }
    const allFilesHaveSettled = this.files.every(file => {
      return [FileState.Uploaded, FileState.Aborted].includes(file.state);
    });
    if (allFilesHaveSettled) {
      this.files.forEach(file => file.queue = undefined);
      _classPrivateFieldGet2(_distinctFiles, this).clear();
    }
  }
}), _applyDecoratedDescriptor(_class.prototype, "add", [action], Object.getOwnPropertyDescriptor(_class.prototype, "add"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "remove", [action], Object.getOwnPropertyDescriptor(_class.prototype, "remove"), _class.prototype), _class);

const DEFAULT_QUEUE = Symbol('DEFAULT_QUEUE');

/**
 * The file queue service is a global file
 * queue that manages all files being uploaded.
 *
 * This service can be used to query the current
 * upload state when a user leaves the app,
 * asking them whether they want to cancel
 * the remaining uploads.
 */
var _queues = /*#__PURE__*/new WeakMap();
class FileQueueService extends s__default {
  constructor() {
    super();
    // Create default queue the first time this service is accessed and instantiated
    // Helps to avoid backtracking re-render issues
    _defineProperty(this, "queues", new TrackedMap());
    /**
     * Identical untracked map to avoid mutating tracked state during rendering
     * when checking for existing queues.
     */
    _classPrivateFieldInitSpec(this, _queues, new Map());
    this.create(DEFAULT_QUEUE);
  }

  /**
   * Returns a queue with the given name
   *
   * @param name The name of the queue to find
   * @returns The queue if it exists
   */
  find(name) {
    return _classPrivateFieldGet2(_queues, this).get(name);
  }

  /**
   * Create a new queue with the given name.
   *
   * @param name The name of the queue to create
   * @returns The new queue.
   */
  create(name) {
    assert(`Queue names are required to be unique. "${String(name)}" has already been reserved.`, !_classPrivateFieldGet2(_queues, this).has(name));
    const queue = new Queue({
      name,
      fileQueue: this
    });
    registerDestructor(queue, () => {
      _classPrivateFieldGet2(_queues, this).delete(name);
      this.queues.delete(name);
    });
    _classPrivateFieldGet2(_queues, this).set(name, queue);
    this.queues.set(name, queue);
    return queue;
  }
  findOrCreate(name) {
    return this.find(name) ?? this.create(name);
  }

  /**
   * The list of all files in queues. This automatically gets
   * flushed when all the files in the queue have settled.
   *
   * @remarks
   * Note that files that have failed need to be manually
   * removed from the queue. This is so they can be retried
   * without resetting the state of the queue, orphaning the
   * file from its queue. Upload failures can happen due to a
   * timeout or a server response. If you choose to use the
   * `abort` method, the file will fail to upload, but will
   * be removed from the requeuing proccess, and will be
   * considered to be in a settled state.
   *
   * @defaultValue []
   */
  get files() {
    return [...this.queues.values()].reduce((acc, queue) => {
      return [...acc, ...queue.files];
    }, []);
  }

  /**
   * The current time in ms it is taking to upload 1 byte.
   *
   * @defaultValue 0
   */
  get rate() {
    return this.files.filter(file => file.state === FileState.Uploading).reduce((acc, {
      rate
    }) => {
      return acc + rate;
    }, 0);
  }

  /**
   * The total size of all files currently being uploaded in bytes.
   *
   * @defaultValue 0
   */
  get size() {
    return this.files.reduce((acc, {
      size
    }) => {
      return acc + size;
    }, 0);
  }

  /**
   * The number of bytes that have been uploaded to the server.
   *
   * @defaultValue 0
   */
  get loaded() {
    return this.files.reduce((acc, {
      loaded
    }) => {
      return acc + loaded;
    }, 0);
  }

  /**
   * The current progress of all uploads, as a percentage in the
   * range of 0 to 100.
   *
   * @defaultValue 0
   */
  get progress() {
    const percent = this.loaded / this.size || 0;
    return Math.floor(percent * 100);
  }
}

export { DEFAULT_QUEUE as D, FileQueueService as F, Queue as Q, UploadFile as U };
//# sourceMappingURL=file-queue-Cebcdh92.js.map
