import { _ as _applyDecoratedDescriptor, b as _initializerDefineProperty } from '../rate-b0qPHNDH.js';
import Helper from '@ember/component/helper';
import { registerDestructor } from '@ember/destroyable';
import * as s from '@ember/service';
import { D as DEFAULT_QUEUE } from '../file-queue-CL7yCykP.js';

var _class, _descriptor;
const service = s.service ?? s.inject;

/**
 * `file-queue` helper is one of the core primitives of ember-file-upload.
 *
 * @example
 *
 * using the default queue (no `name` property)
 *
 * ```hbs
 * {{#let (file-queue) as |queue|}}
 *   {{queue.progress}}%
 * {{/let}}
 * ```
 *
 * @example
 *
 * named queue:
 *
 * ```hbs
 * {{#let (file-queue name="photos") as |queue|}}
 *   {{queue.progress}}%
 * {{/let}}
 * ```
 */
let FileQueueHelper = (_class = class FileQueueHelper extends Helper {
  constructor(...args) {
    super(...args);
    _initializerDefineProperty(this, "fileQueue", _descriptor, this);
  }
  compute(_positional, named) {
    this.named = named;
    const queue = this.fileQueue.findOrCreate(named.name ?? DEFAULT_QUEUE);
    queue.addListener(this);
    registerDestructor(this, () => {
      queue.removeListener(this);
    });
    return queue;
  }
  onFileAdded(file) {
    this.named.onFileAdded?.(file);
  }
  onFileRemoved(file) {
    this.named.onFileRemoved?.(file);
  }
  onUploadStarted(file) {
    this.named.onUploadStarted?.(file);
  }
  onUploadSucceeded(file, response) {
    this.named.onUploadSucceeded?.(file, response);
  }
  onUploadFailed(file, response) {
    this.named.onUploadFailed?.(file, response);
  }
}, _descriptor = _applyDecoratedDescriptor(_class.prototype, "fileQueue", [service], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: null
}), _class);

export { FileQueueHelper as default };
//# sourceMappingURL=file-queue.js.map
