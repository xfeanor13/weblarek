import { IBaseFormView } from '../../../types';
import { IEvents } from '../../core/EventEmitter';
import { Component } from '../shared/Component';
import { BaseFormView } from './BaseFormView';
import { AppEvents } from '../../../utils/constants';

// Интерфейс формы для сбора контактных данных
export interface IContactsFormView extends IBaseFormView {
	set email (email: string);
	set phone (text: string);
}

interface contactsFormProps {
	emailInputElement: HTMLInputElement;
	phoneInputElement: HTMLInputElement;
}

export class ContactsFormView extends BaseFormView implements IContactsFormView {
	protected events: IEvents
	protected emailInput: HTMLInputElement; 
	protected phoneInput: HTMLInputElement; 
	protected submitButton: HTMLButtonElement; 

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.events	= events;
		this.emailInput = container.querySelector('input[name = email]'); 
		this.phoneInput = container.querySelector('input[name = phone]'); 
		this.submitButton = container.querySelector('button[type = submit]'); 

		// Слушатель ввода email
		this.emailInput.addEventListener('input', () => { 
			events.emit(AppEvents.FormContactsInputEmail, { email: this.emailInput.value }); 
			console.log('Ввод в поле email');
		})

		// Слушатель ввода phone
		this.phoneInput.addEventListener('input', () => { 
			events.emit(AppEvents.FormContactsInputPhone, { phone: this.phoneInput.value }); 
			console.log('Ввод в поле phone'); 
		})

		// Слушатель сабмита формы
		this.container.addEventListener('submit', (event) => {
			event.preventDefault();
			events.emit(AppEvents.FormContactsSubmit);
		})
	}

	set email (email: string) {
		this.emailInput.value = email; 
	}

	set phone (phone: string) {
		this.phoneInput.value = phone; 
	}

	set submitButtonDisable(isValid: boolean) {
		if(isValid) {
			this.submitButton.disabled = false; 
		}
		else {
			this.submitButton.disabled = true; 
		}
	}

}