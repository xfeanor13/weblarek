import { CardFullView } from './CardFullView';
import { ICardBaseView, ICardFullView } from '../../../types';
import { IEvents } from '../../core/EventEmitter';
import { AppEvents } from '../../../utils/constants';

// Интерфейс выбранной карточки товара
export interface ICardPreviewView extends ICardBaseView, ICardFullView {
	set description (text: string);
}

export class CardInPreviewView extends CardFullView implements ICardPreviewView {
	protected descriptionElement: HTMLElement; 
	protected actionButton: HTMLButtonElement; 

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.descriptionElement = container.querySelector('.card__text'); 
		this.actionButton = container.querySelector('.card__button'); 

		// Слушатель клика по кнопке купить
		this.actionButton.addEventListener('click', () => { 
			events.emit(AppEvents.CardButtonClick, { id: this.cardId });
		})
	}

	set description(text: string) {
		this.descriptionElement.textContent = text; 
	}

	setRemoveButtonText() { 
		this.actionButton.textContent = 'Удалить из корзины'; 
	}

	setBuyButtonText() { 
		this.actionButton.textContent = 'Купить'; 
	}

	set buttonDisable(value: boolean) {
		this.actionButton.disabled = value; 
		this.actionButton.textContent = 'Недоступно'; 
	}
}