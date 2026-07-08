/**
  Triggers a `change` event on a `FileUpload` input with `files`.

  All `files` must be [HTML5 File objects](https://developer.mozilla.org/en-US/docs/Web/API/File).

  A single file, or multiple files may be passed as arguments.

  ```javascript
    // A single file
    const file = new File([], 'dingus.txt');
    await selectFiles('.file-upload input', file);
  ```

  ```javascript
    // Multiple files
    const file1 = new File([], 'dingus1.txt');
    const file2 = new File([], 'dingus2.txt');
    await selectFiles('.file-upload input', file1, file2);
  ```

  Returns `Promise<void>` which resolves when the application is settled.

  @function selectFiles
  @param {string | HTMLElement} target The element or selector representing a file input
  @param {File} ...files One or more File objects
  @return {Promise}
 */
export declare function selectFiles(target: string | HTMLElement, ...files: (File | Blob)[]): Promise<void>;
/**
  Triggers `dragenter`, `dragover`, and `drop` events on a `FileDropzone` with `files`.

  All `files` must be [HTML5 File objects](https://developer.mozilla.org/en-US/docs/Web/API/File).

  A single file, or multiple files may be passed as arguments.

  ```javascript
    // A single file
    const file = new File([], 'dingus.txt');
    await dragAndDrop('.file-dropzone', file);
  ```

  ```javascript
    // Multiple files
    const file1 = new File([], 'dingus1.txt');
    const file2 = new File([], 'dingus2.txt');
    await dragAndDrop('.file-dropzone', file1, file2);
  ```

  Returns `Promise<void>` which resolves when the application is settled.

  @function dragAndDrop
  @param {string | HTMLElement} target The element or selector representing a FileDropzone
  @param {File} ...files One or more File objects
  @return {Promise}
 */
export declare function dragAndDrop(target: string | HTMLElement, ...files: (File | Blob)[]): Promise<void>;
/**
  A directory to simulate dropping onto a `FileDropzone` with
  `dragAndDropDirectory`. Directories may be nested arbitrarily deep.
 */
export interface DirectoryStub {
    name: string;
    files?: File[];
    directories?: DirectoryStub[];
}
/**
  Triggers `dragenter`, `dragover`, and `drop` events on a `FileDropzone`
  with one or more directories, simulating a folder drop.

  Only has an effect when the dropzone has `@allowFolderDrop={{true}}`.

  ```javascript
    await dragAndDropDirectory('.file-dropzone', {
      directories: [
        {
          name: 'reports',
          files: [new File([], 'summary.pdf')],
          directories: [
            { name: 'q3', files: [new File([], 'deck.pdf')] },
          ],
        },
      ],
      // loose files dropped alongside the directory
      files: [new File([], 'notes.txt')],
    });
  ```

  Returns `Promise<void>` which resolves when the application is settled.

  @function dragAndDropDirectory
  @param {string | HTMLElement} target The element or selector representing a FileDropzone
  @param {Object} options `directories` to drop and optional loose `files`
  @return {Promise}
 */
export declare function dragAndDropDirectory(target: string | HTMLElement, options: {
    directories: DirectoryStub[];
    files?: File[];
}): Promise<void>;
/**
  Triggers a `dragenter` event on a `FileDropzone` with `files`.

  All `files` must be [HTML5 File objects](https://developer.mozilla.org/en-US/docs/Web/API/File).

  A single file, or multiple files may be passed as arguments.

  ```javascript
    // A single file
    const file = new File([], 'dingus.txt');
    await dragEnter('.file-dropzone', file);
  ```

  ```javascript
    // Multiple files
    const file1 = new File([], 'dingus1.txt');
    const file2 = new File([], 'dingus2.txt');
    await dragEnter('.file-dropzone', file1, file2);
  ```

  Returns `Promise<void>` which resolves when the application is settled.

  @function dragEnter
  @param {string | HTMLElement} target The element or selector representing a FileDropzone
  @param {File} ...files One or more File objects
  @return {Promise}
 */
export declare function dragEnter(target: string | HTMLElement, ...files: (File | Blob)[]): Promise<void>;
/**
  Triggers a `dragleave` event on a `FileDropzone` with `files`.

  All `files` must be [HTML5 File objects](https://developer.mozilla.org/en-US/docs/Web/API/File).

  A single file, or multiple files may be passed as arguments.

  ```javascript
    // A single file
    const file = new File([], 'dingus.txt');
    await dragLeave('.file-dropzone', file);
  ```

  ```javascript
    // Multiple files
    const file1 = new File([], 'dingus1.txt');
    const file2 = new File([], 'dingus2.txt');
    await dragLeave('.file-dropzone', file1, file2);
  ```

  Returns `Promise<void>` which resolves when the application is settled.

  @function dragLeave
  @param {string | HTMLElement} target The element or selector representing a FileDropzone
  @param {File} ...files One or more File objects
  @return {Promise}
 */
export declare function dragLeave(target: string | HTMLElement, ...files: (File | Blob)[]): Promise<void>;
