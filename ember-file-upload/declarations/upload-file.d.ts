import type { Queue } from './queue.ts';
import { FileSource, FileState, type UploadOptions } from './interfaces.ts';
/**
 * Files provide a uniform interface for interacting
 * with data that can be uploaded or read.
 */
export declare class UploadFile {
    #private;
    file: File;
    queue?: Queue;
    constructor(file: File, source: FileSource, relativePath?: string);
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
     */
    get relativePath(): string;
    /**
     * The source of the file. This is useful
     * for applications that want to gather
     * analytics about how users upload their
     * content.
     */
    get source(): FileSource;
    /** A unique id generated for this file. */
    get id(): string;
    /** The file name */
    get name(): string;
    set name(value: string);
    /** The current speed in ms that it takes to upload one byte */
    get rate(): number;
    /** The size of the file in bytes. */
    get size(): number;
    set size(value: number);
    /**
     * The MIME type of the file.
     *
     * For a image file this may be `image/png`.
     */
    get type(): string;
    /**
     * Returns the appropriate file extension of
     * the file according to the type
     */
    get extension(): string;
    /**
     * Tracks the number of bytes that had been uploaded when progress values last changed.
     */
    bytesWhenProgressLastUpdated: number;
    /** The number of bytes that have been uploaded to the server */
    loaded: number;
    /**
     * The current progress of the upload, as a percentage in the
     * range of 0 to 100.
     */
    progress: number;
    /**
     * When upload has finished this property will be set to true
     */
    isUploadComplete: boolean;
    /**
     * The current state that the file is in.
     */
    state: FileState;
    /**
     * The timestamp of when the progress last updated in milliseconds. Used to calculate the time
     * that has elapsed.
     */
    timestampWhenProgressLastUpdated: number;
    rates: number[];
    /**
     * Upload file with `application/octet-stream` content type.
     *
     * @param url Your server endpoint where to upload the file
     * @param options additional request options
     */
    uploadBinary(url: string, options: UploadOptions): Promise<Response>;
    /**
     * Upload file to your server
     *
     * @param url Your server endpoint where to upload the file
     * @param options additional options, eg. `{ fileKey: string, data: { key: string } }`
     */
    upload(url: string, options?: UploadOptions): Promise<Response>;
    /**
     * Resolves with Blob as ArrayBuffer
     */
    readAsArrayBuffer(): import("rsvp").default.Promise<string | ArrayBuffer | null>;
    /**
     * Resolves with Blob as DataURL
     */
    readAsDataURL(): import("rsvp").default.Promise<string | ArrayBuffer | null>;
    /**
     * Resolves with Blob as binary string
     */
    readAsBinaryString(): import("rsvp").default.Promise<string | ArrayBuffer | null>;
    /**
     * Resolves with Blob as plain text
     */
    readAsText(): import("rsvp").default.Promise<string | ArrayBuffer | null>;
    /**
     * Creates a file object that can be read or uploaded to a
     * server from a Blob object.
     *
     * @param blob the blob to create the file from.
     * @param source the source that created the blob.
     * @returns the file
     */
    static fromBlob(blob: Blob, source?: FileSource): UploadFile;
    /**
     * Creates a file object that can be read or uploaded to a
     * server from a data URL.
     *
     * @param dataURL the data URL to create the file from.
     * @param source the source of the data URL.
     * @returns the file
     */
    static fromDataURL(dataURL: string, source?: FileSource): UploadFile;
}
