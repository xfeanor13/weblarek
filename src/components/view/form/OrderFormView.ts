import { IEvents } from '../../core/EventEmitter';
import { Component } from '../shared/Component';
import { IBaseFormView, IUser } from '../../../types';
import { AppEvents } from '../../../utils/constants';
import { BaseFormView } from './BaseFormView';

interface OrderFormProps {
	address: string | null;
	validateUser(value: boolean): boolean;
}

// Интерфейс формы сбора информации об оплате и адресе
export interface IOrderFormView extends IBaseFormView {
	set address (text: string);
	set enableSubmit(value: boolean);
	set submitButtonDisable(isValid: boolean);
}

export class OrderFormView extends BaseFormView implements IOrderFormView {
	protected events: IEvents;
	protected onlinePaymentButton: HTMLButtonElement; 
	protected cashPaymentButton: HTMLButtonElement;
	protected addressInput: HTMLInputElement; 
	protected submitButton: HTMLButtonElement; 
	protected errorContainer: HTMLElement; 

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.events = events;
		this.onlinePaymentButton = container.querySelector('button[name = "card"]'); 
		this.cashPaymentButton = container.querySelector('button[name = "cash"]');
		this.addressInput = container.querySelector('input[name = "address"]'); 
		this.submitButton = container.querySelector('button[type = "submit"]'); 
		this.errorContainer = container.querySelector('.form__errors'); 

		// Слушатель выбора метода оплаты онлайн
		this.onlinePaymentButton.addEventListener('click', () => { 
			this.events.emit(AppEvents.FormOrderOnline, {payment: 'card'});
			console.log('Клик по кнопке оплаты онлайн')
		})

		// Слушатель выбора метода оплаты наличными
		this.cashPaymentButton.addEventListener('click', () => {
			this.events.emit(AppEvents.FormOrderCash, {payment: 'cash'});
			console.log('Клик по кнопке оплаты наличными')
		})

		// Слушатель ввода адреса
		this.addressInput.addEventListener('input', () => { 
			events.emit(AppEvents.FormOrderInput, { address: this.addressInput.value }); 
			console.log('Ввод в поле адрес');
		})

		// Слушатель сабмита формы
		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			events.emit(AppEvents.FormOrderSubmit);
		})
	}

	set enableSubmit(value: boolean) {
		if (value) {
			this.submitButton.disabled = false; 
		}
		else {
			this.submitButton.disabled = true; 
		}
	}

	set address(text: string) {
		this.addressInput.value = text; 
	}

	set activePaymentButton(isOnline: boolean) { 
		if(isOnline) {
			this.onlinePaymentButton.classList.add('button_alt-active'); 
			this.cashPaymentButton.classList.remove('button_alt-active');
		}
		else {
			this.cashPaymentButton.classList.add('button_alt-active');
			this.onlinePaymentButton.classList.remove('button_alt-active'); 
		}
	}

	set error(text: string) {
		this.errorContainer.textContent = text; 
	}

	set submitButtonDisable(isValid: boolean) {
		if(isValid) {
			this.submitButton.disabled = false; 
		}
		else {
			this.submitButton.disabled = true; 
		}
	}

	clearButtonState() {
		this.onlinePaymentButton.classList.remove('button_alt-active'); 
		this.cashPaymentButton.classList.remove('button_alt-active');
	}
}