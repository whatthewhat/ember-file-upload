import RSVP from 'rsvp';
import type { HTTPRequestOptions } from '../interfaces.ts';
export default class HTTPRequest {
    onloadstart: (event?: ProgressEvent<EventTarget>) => void | undefined;
    onprogress: (event?: ProgressEvent<EventTarget>) => void | undefined;
    onloadend: (event?: ProgressEvent<EventTarget>) => void | undefined;
    ontimeout: (event?: ProgressEvent<EventTarget>) => void | undefined;
    onabort: (event?: ProgressEvent<EventTarget>) => void | undefined;
    request: XMLHttpRequest;
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
    promise: RSVP.Promise<Response>;
    constructor(options?: HTTPRequestOptions);
    send(body: Parameters<XMLHttpRequest['send']>[0]): RSVP.Promise<Response>;
    open(method: string, url: string | URL, _async: boolean, usename?: string, password?: string): void;
    setRequestHeader(name: string, value: string): void;
}
