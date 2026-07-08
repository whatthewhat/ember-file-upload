import Helper from '@ember/component/helper';
import type { UploadFile } from '../upload-file.ts';
import type FileQueueService from '../services/file-queue.ts';
import type { FileQueueSignature, QueueListener } from '../interfaces.ts';
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
export default class FileQueueHelper extends Helper<FileQueueSignature> implements QueueListener {
    fileQueue: FileQueueService;
    named: FileQueueSignature['Args']['Named'];
    compute(_positional: FileQueueSignature['Args']['Positional'], named: FileQueueSignature['Args']['Named']): import("../queue.ts").Queue;
    onFileAdded(file: UploadFile): void;
    onFileRemoved(file: UploadFile): void;
    onUploadStarted(file: UploadFile): void;
    onUploadSucceeded(file: UploadFile, response: Response): void;
    onUploadFailed(file: UploadFile, response: Response): void;
}
