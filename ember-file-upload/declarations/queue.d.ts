import { UploadFile } from './upload-file.ts';
import type FileQueueService from './services/file-queue.ts';
import { type QueueListener, type QueueName } from './interfaces.ts';
/**
 * The Queue is a collection of files that
 * are being manipulated by the user.
 *
 * Queues are designed to persist the state
 * of uploads when a user navigates around your
 * application.
 */
export declare class Queue {
    #private;
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
    get name(): QueueName;
    /** The FileQueue service. */
    fileQueue: FileQueueService;
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
    get files(): UploadFile[];
    /**
     * The current time in ms it is taking to upload 1 byte.
     *
     * @defaultValue 0
     */
    get rate(): number;
    /**
     * The total size of all files currently being uploaded in bytes.
     *
     * @defaultValue 0
     */
    get size(): number;
    /**
     * The number of bytes that have been uploaded to the server.
     *
     * @defaultValue 0
     */
    get loaded(): number;
    /**
     * The current progress of all uploads, as a percentage in the
     * range of 0 to 100.
     *
     * @defaultValue 0
     */
    get progress(): number;
    constructor({ name, fileQueue, }: {
        name: QueueName;
        fileQueue: FileQueueService;
    });
    addListener(listener: QueueListener): void;
    removeListener(listener: QueueListener): void;
    /**
     * Add a file to the queue
     * @param file the file to be added
     */
    add(file: UploadFile): void;
    /**
     * Remove a file from the queue
     * @param file the file to be removed
     */
    remove(file: UploadFile): void;
    uploadStarted(file: UploadFile): void;
    uploadSucceeded(file: UploadFile, response: Response): void;
    uploadFailed(file: UploadFile, response: Response): void;
    /**
     * Flushes the `files` property if they have settled. This
     * will only flush files when all files have arrived at a terminus
     * of their state chart (`uploaded` and `aborted`).
     *
     * Files *may* be requeued by the user in the `failed` or `timed_out`
     * states.
     */
    flush(): void;
    selectFile: import("ember-modifier").FunctionBasedModifier<{
        Element: HTMLInputElement;
        Args: {
            Named: {
                filter?: (file: File, files: File[], index: number, relativePath: string) => boolean;
                onFilesSelected?: (files: UploadFile[]) => void;
            };
            Positional: [];
        };
    }>;
}
