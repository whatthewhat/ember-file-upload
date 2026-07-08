import Modifier, { type ArgsFor, type NamedArgs } from 'ember-modifier';
import type { DragListenerModifierSignature } from '../interfaces.ts';
import DragListener from './drag-listener.ts';
import type Owner from '@ember/owner';
export default class DragListenerModifier extends Modifier<DragListenerModifierSignature> {
    listener?: DragListener;
    constructor(owner: Owner, args: ArgsFor<DragListenerModifierSignature>);
    modify(dropzone: Element, _: [], { dragenter, dragleave, dragover, drop, }: NamedArgs<DragListenerModifierSignature>): void;
}
