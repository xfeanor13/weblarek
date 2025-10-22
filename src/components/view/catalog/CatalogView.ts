import { IEvents } from '../../core/EventEmitter';
import { cloneTemplate, ensureElement } from '../../../utils/utils';
import { Component } from '../shared/Component';
import { ICard, ICatalogView } from '../../../types';

export class CatalogView extends Component<ICatalogView> implements ICatalogView {
	protected events: IEvents;
	protected pageWrapperElement: HTMLElement; 

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.pageWrapperElement = ensureElement('.page__wrapper'); 
	}

	set content(items: HTMLElement[]) { 
		this.container.replaceChildren(...items);
	}

	set locked(isOpen: boolean) {
		if(isOpen) {
			this.pageWrapperElement.classList.add('page__wrapper_locked'); 
		}
		else {
			this.pageWrapperElement.classList.remove('page__wrapper_locked'); 
		}
	}
}