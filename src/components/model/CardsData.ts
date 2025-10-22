import { ICard, ICardsData } from '../../types';
import { IEvents } from '../core/EventEmitter';
import { AppEvents } from '../../utils/constants';

export class CardsData implements ICardsData {
	protected events: IEvents;
	protected productItems: ICard[]; 
	protected preview: ICard;

	constructor(events: IEvents) {
		this.events = events;
	}

	// Сохранить карточки товаров
	setItems(items: ICard[]) { 
		this.productItems = items; 
		this.events.emit(AppEvents.CardsSaved);
	}

	// Вернуть карточки товаров
	getItems(): ICard[] { 
		return this.productItems; 
	}

	// Вернуть карточку по id
	getItem(id: string): ICard { 
		return this.productItems.find((item) => item.id === id); 
	}
}