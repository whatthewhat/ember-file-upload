import type { FileUploadDragEvent } from '../interfaces.ts';
import { type FileWithPath } from './directory-reader.ts';
export default class DataTransferWrapper {
    dataTransfer?: DataTransfer;
    itemDetails?: FileUploadDragEvent['itemDetails'];
    source?: FileUploadDragEvent['source'];
    constructor(event: FileUploadDragEvent);
    getData(type: string): string | undefined;
    get filesOrItems(): DataTransferItem[] | {
        kind: string;
        type: string;
    }[] | File[];
    /**
     * Read all dropped files, recursing into dropped directories.
     *
     * Must be called synchronously from the `drop` event handler — browsers
     * neuter `DataTransferItem`s once the handler yields.
     */
    getFilesWithPaths(): Promise<FileWithPath[]>;
    get files(): File[];
    get items(): DataTransferItem[] | {
        kind: string;
        type: string;
    }[];
}
