export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {

};

export enum AppEvents {
	CardsSaved = 'cards:saved',
	PaymentMethodSaved = 'payment:methodSaved', 
	AddressSaved = 'address: saved',
	EmailSaved = 'email:saved',
	PhoneSaved = 'phone:saved',
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	ProductOpen = 'product:open',
	CardButtonClick = 'cardButton:click',
	BasketOpen = 'basket:open',
	BasketDelete = 'basket:delete',
	BasketOrder = 'basket:order',
	BasketChanged = 'basket:changed',
	FormOrderSubmit = 'formOrder:submit',
	FormContactsInputEmail = 'formContactsEmail:input',
	FormContactsInputPhone = 'formContactsPhone:input',
	FormOrderOnline = 'formOrder:online',
	FormOrderCash = 'formOrder:cash',
	FormOrderInput = 'formOrder:input',
	FormContactsSubmit = 'formContacts:submit',
	OrderSuccessConfirm = 'orderSuccess:confirm' 
}

export const categoryClasses: Record<string, string> = {
	'другое' : 'card__category_other',
	'софт-скил': 'card__category_soft',
	'дополнительное' : 'card__category_additional',
	'кнопка' : 'card__category_button',
	'хард-скил': 'card__category_hard',
};