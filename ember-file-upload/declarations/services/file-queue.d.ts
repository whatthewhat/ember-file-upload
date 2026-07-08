import Service from '@ember/service';
import { Queue } from '../queue.ts';
import type { UploadFile } from '../upload-file.ts';
import { type QueueName } from '../interfaces.ts';
import { TrackedMap } from 'tracked-built-ins';
export declare const DEFAULT_QUEUE: unique symbol;
/**
 * The file queue service is a global file
 * queue that manages all files being uploaded.
 *
 * This service can be used to query the current
 * upload state when a user leaves the app,
 * asking them whether they want to cancel
 * the remaining uploads.
 */
export default class FileQueueService extends Service {
    #private;
    queues: TrackedMap<QueueName, Queue>;
    constructor();
    /**
     * Returns a queue with the given name
     *
     * @param name The name of the queue to find
     * @returns The queue if it exists
     */
    find(name: QueueName): Queue | undefined;
    /**
     * Create a new queue with the given name.
     *
     * @param name The name of the queue to create
     * @returns The new queue.
     */
    create(name: QueueName): Queue;
    findOrCreate(name: QueueName): Queue;
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
}
