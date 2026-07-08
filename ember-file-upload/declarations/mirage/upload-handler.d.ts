interface FakeRequest {
    requestBody: FormData | object;
    upload: {
        onloadstart: (event: ProgressEvent<EventTarget>) => void;
        onprogress: (event: ProgressEvent<EventTarget>) => void;
        onloadend: (event: ProgressEvent<EventTarget>) => void;
    };
}
export declare function uploadHandler(fn: (this: void, db: unknown, request: FakeRequest) => void, options?: {
    network: null;
    timeout: null;
}): (db: unknown, request: FakeRequest) => Promise<unknown>;
export {};
