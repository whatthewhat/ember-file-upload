import Component from '@glimmer/component';
import DataTransferWrapper from '../system/data-transfer-wrapper.ts';
import type { FileWithPath } from '../system/directory-reader.ts';
import { UploadFile } from '../upload-file.ts';
import type FileQueueService from '../services/file-queue.ts';
import { type FileUploadDragEvent, type FileDropzoneSignature } from '../interfaces.ts';
import DragListenerModifier from '../system/drag-listener-modifier.ts';
/**
  `FileDropzone` is a component that will allow users to upload files by
   drag and drop.

  ```hbs
  <FileDropzone @queue={{queue}} as |dropzone|>
    {{#if dropzone.active}}
      Drop to upload
    {{else if queue.files.length}}
      Uploading {{queue.files.length}} files. ({{queue.progress}}%)
    {{else}}
      <h4>Upload Images</h4>
      <p>
        {{#if dropzone.supported}}
          Drag and drop images onto this area to upload them or
        {{/if}}
      </p>
    {{/if}}
  </FileDropzone>
  ```

  @class FileDropzoneComponent
  @type Ember.Component
  @yield {Hash} dropzone
  @yield {boolean} dropzone.supported
  @yield {boolean} dropzone.active
  @yield {Queue} queue
 */
export default class FileDropzoneComponent extends Component<FileDropzoneSignature> {
    fileQueue: FileQueueService;
    active: boolean;
    dataTransferWrapper?: DataTransferWrapper;
    supported: boolean;
    get queue(): import("../queue.ts").Queue;
    get multiple(): boolean;
    get files(): File[];
    get isAllowed(): boolean | undefined;
    get cursor(): "link" | "none" | "copy" | "move";
    didEnterDropzone(event: FileUploadDragEvent): void;
    didLeaveDropzone(event: FileUploadDragEvent): void;
    didDragOver(event: FileUploadDragEvent): void;
    didDrop(event: FileUploadDragEvent): Promise<void>;
    addFiles(files: FileWithPath[]): UploadFile[];
    dragListener: typeof DragListenerModifier;
}
