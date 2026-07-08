import HTTPRequest from './http-request.ts';
import type { UploadFile } from '../upload-file.ts';
import { type UploadOptions } from '../interfaces.ts';
export declare function onloadstart(file: UploadFile, event?: ProgressEvent<EventTarget>): void;
export declare function onprogress(file: UploadFile, event?: ProgressEvent<EventTarget>): void;
export declare function onloadend(file: UploadFile, event?: ProgressEvent<EventTarget>): void;
export declare function upload(file: UploadFile, url: string | object, opts: UploadOptions | undefined, uploadFn: (request: HTTPRequest, options: UploadOptions) => Promise<Response>): Promise<Response>;
