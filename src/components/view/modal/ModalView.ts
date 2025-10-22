import { IModalView } from '../../../types';
import { IEvents } from '../../core/EventEmitter';
import { Component } from '../shared/Component';
import { AppEvents } from '../../../utils/constants';

type ModalProps = {content: HTMLElement};

export class ModalView extends Component<ModalProps> implements IModalView {
	protected events: IEvents;
	protected closeButton: HTMLButtonElement;
	protected contentContainer: HTMLElement; 


	constructor(protected modalElement: HTMLElement, events: IEvents) {
		super(modalElement);
		this.events = events;
		this.closeButton = modalElement.querySelector('.modal__close');
		this.contentContainer = modalElement.querySelector('.modal__content'); 
		this.closeButton.addEventListener('click', () => {
			this.closeModal();
		})
		this.modalElement.addEventListener('mousedown', (evt) => {
			if(evt.target === evt.currentTarget) {
				this.closeModal();
			}
		})
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	set content(element: HTMLElement) {
		this.contentContainer.replaceChildren(element); 
	}

	openModal() {
		this.modalElement.classList.add('modal_active');
		document.addEventListener('keyup', this.handleEscUp);
		this.events.emit(AppEvents.ModalOpen);
	}

	closeModal() {
		this.modalElement.classList.remove('modal_active');
		document.removeEventListener('keyup', this.handleEscUp);
		this.events.emit(AppEvents.ModalClose);
	}

	handleEscUp (evt: KeyboardEvent) {
		if (evt.key === "Escape") {
			this.closeModal();
		}
	};

}