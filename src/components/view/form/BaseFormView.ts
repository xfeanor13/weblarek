import { Component } from '../shared/Component';
import { IBaseFormView, IUser } from '../../../types';
import { IEvents } from '../../core/EventEmitter';

interface BaseFormProps {
	error?: string;
	submitButtonDisable: boolean;
	enableSubmit: boolean;
}

export class BaseFormView extends Component<BaseFormProps> implements IBaseFormView {
	protected container: HTMLFormElement;
	protected inputsElement: NodeListOf<HTMLInputElement>;
	protected errorsElement: HTMLElement;
	protected submitButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container);
		this.container = container;
		this.inputsElement = container.querySelectorAll('.form__input');
		this.errorsElement = container.querySelector('.form__errors');
		this.submitButton = container.querySelector('button[type = "submit"]');
	}

	resetForm() {
		this.container.reset();
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