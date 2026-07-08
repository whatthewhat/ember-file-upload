interface AdditionalMetadata {
    hasAdditionalMetadata?: boolean;
    duration?: number;
    animated?: boolean;
    width?: number;
    height?: number;
}
interface FileMetadata extends AdditionalMetadata {
    name: string;
    size: number;
    type: string;
    extension?: string;
    url: string;
}
export declare function extractFormData(formData: FormData): {
    file: {
        key: string;
        value: File;
    };
    data: {};
};
export declare function extractFileMetadata(file: File): Promise<FileMetadata>;
export {};
