import type { DragEventListener, QueuedDragEvent, DragListenerHandlers, FileUploadDragEvent } from '../interfaces.ts';
export default class DragListener {
    _dropzone?: Element;
    _listeners: DragEventListener[];
    _stack: DragEventListener[];
    _listener: DragEventListener | null;
    _events: QueuedDragEvent[];
    _handlers: DragListenerHandlers;
    _handlersAttached: boolean;
    constructor(dropzone: Element);
    beginListening(): void;
    endListening(): void;
    addEventListeners(handlers: DragListenerHandlers): void;
    removeEventListeners(): void;
    findListener(evt: FileUploadDragEvent): DragEventListener | undefined;
    getEventSource(evt: FileUploadDragEvent): "os" | "web";
    getDataTransferItemDetails(evt: FileUploadDragEvent): {
        kind: string;
        type: string;
    }[];
    dragenter(evt: Event): void;
    dragleave(evt: Event): void;
    dragover(evt: Event): void;
    scheduleEvent(eventName: QueuedDragEvent['eventName'], listener: QueuedDragEvent['listener'], event: QueuedDragEvent['event']): void;
    sendEvents(): void;
    drop(evt: Event): void;
}
