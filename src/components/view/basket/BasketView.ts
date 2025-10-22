import { Component } from '../shared/Component';
import { IEvents } from '../../core/EventEmitter';
import { ICard } from '../../../types';
import { AppEvents } from '../../../utils/constants';

export type BasketProps = {totalPrice: number, content: HTMLElement[], submitButtonDisable: boolean};

export class BasketView extends Component<BasketProps> {
	protected events: IEvents;
	protected submitButtonElement: HTMLButtonElement;
	protected totalPriceElement: HTMLElement; 
	protected basketListElement: HTMLElement; 
	
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.submitButtonElement = container.querySelector('.basket__button');
		this.totalPriceElement = container.querySelector('.basket__price'); 
		this.basketListElement = container.querySelector('.basket__list'); 

		this.submitButtonElement.addEventListener('click', ()=> {
			this.events.emit(AppEvents.BasketOrder);
		})
	}

	set totalPrice(totalPrice: number) {
		this.totalPriceElement.textContent = `${totalPrice} синапсов`; 
	}

	set content(items:HTMLElement[]) {
		this.basketListElement.replaceChildren(...items); 
	}

	set submitButtonDisable(isEmpty: boolean) {
		if(isEmpty) {
			this.submitButtonElement.disabled = true;
		}
		else {
			this.submitButtonElement.disabled = false;
		}
	}
}