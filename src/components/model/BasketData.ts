import { ICard } from '../../types';
import { IEvents } from '../core/EventEmitter';
import { AppEvents } from '../../utils/constants';

// Интерфейс класса данных корзины
export interface IBasketData {
	addItem (item: ICard): void; 
	removeItem (id: string): void; 
	getTotalPrice(): number;
	getItems (): ICard[]; 
	isItemInBasket (id: string): boolean; 
}

export class BasketData implements IBasketData {
	protected events: IEvents;
	protected basketItems: ICard[]; 

	constructor(events: IEvents) {
		this.events = events;
		this.basketItems = []; 
	}

	addItem(item: ICard) { 
		if (!this.isItemInBasket(item.id)) { 
			this.basketItems.push(item); 
			this.events.emit(AppEvents.BasketChanged);
		}
		else {
			console.log(`${item.title} уже есть в корзине`)
		}
	}

	removeItem(id: string) { 
		this.basketItems = this.basketItems.filter(item => item.id !== id); 
		this.events.emit(AppEvents.BasketChanged);
	}

	getTotalPrice(): number {
		return this.basketItems.reduce((sum, item) => sum + item.price, 0); 
	}

	getItems(): ICard[] { 
		return this.basketItems; 
	}

	isItemInBasket(id: string): boolean { 
		return this.basketItems.some(item => item.id === id); 
	}

	getItemsCount() { 
		return this.basketItems.length; 
	}

	isBasketEmpty() { 
		if(this.basketItems.length) { 
			return false;
		}
		else {
			return true;
		}
	}

	clearBasket() { 
		this.basketItems = []; 
		this.events.emit(AppEvents.BasketChanged);
	}
}