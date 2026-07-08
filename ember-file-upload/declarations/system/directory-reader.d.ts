export interface FileWithPath {
    file: File;
    /**
     * Path of the file relative to the dropped directory, including the
     * directory name itself and the file name — e.g. `reports/q3/deck.pdf`.
     *
     * Empty string for files that were not dropped as part of a directory,
     * mirroring `File.webkitRelativePath` semantics.
     */
    relativePath: string;
}
/**
 * Read all files from dropped `DataTransferItem`s, recursing into
 * directories.
 *
 * Must be called synchronously from the `drop` event handler — browsers
 * neuter `DataTransferItem`s once the handler yields, so entries and
 * plain files are captured before this function first awaits.
 */
export declare function readDataTransferItems(items: DataTransferItem[]): Promise<FileWithPath[]>;
