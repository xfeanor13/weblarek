import { Component } from '../shared/Component';
import { CardProps, ICardBaseView } from '../../../types';
import { IEvents } from '../../core/EventEmitter';

// Класс содержит базовые свойства для всех классов карточек
export class CardBaseView extends Component<CardProps> implements ICardBaseView {
	protected titleElement: HTMLElement; 
	protected priceElement: HTMLElement; 
	protected cardId: string;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.titleElement = this.container.querySelector('.card__title'); 
		this.priceElement = this.container.querySelector('.card__price'); 
	}
	
	set title (text: string) {
		this.titleElement.textContent = text; 
	};

	set price (price: number) {
		if(price){
			this.priceElement.textContent = `${price} синапсов`; 
		}
		else {
			this.priceElement.textContent = 'Бесценно'; 
		}
	};

	set id (id: string) {
		this.cardId = id;
	}
}