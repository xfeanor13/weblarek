import { ICardFullView } from '../../../types';
import {CardBaseView} from "./CardBaseView";
import { IEvents } from '../../core/EventEmitter';
import { categoryClasses } from '../../../utils/constants';

// Класс содержит базовые свойства для классов карточек в галерее и превью
export class CardFullView extends CardBaseView implements ICardFullView {
	protected categoryElement: HTMLElement; 
	protected imageElement: HTMLImageElement; 

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.categoryElement = container.querySelector('.card__category'); 
		this.imageElement = container.querySelector('.card__image'); 
	}
	set category (text: string) {
		this.categoryElement.textContent = text; 
		this.categoryElement.className = `card__category ${categoryClasses[text] ?? ''}` 
	};
	set image (link: string) {
		this.imageElement.src = link; 
	};
}