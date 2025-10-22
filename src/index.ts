import './scss/styles.scss';
import { CardsData } from './components/model/CardsData';
import { EventEmitter, IEvents } from './components/core/EventEmitter';
import { IApi, IUser, TUserPayment } from './types';
import { Api } from './components/core/Api';
import { API_URL, AppEvents, CDN_URL } from './utils/constants';
import { AppApi } from './components/core/AppApi';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardInCatalogView } from './components/view/card/CardInCatalogView';
import { CatalogView } from './components/view/catalog/CatalogView';
import { ModalView } from './components/view/modal/ModalView';
import { CardInPreviewView } from './components/view/card/CardInPreviewView';
import { HeaderView } from './components/view/header/HeaderView';
import { CardInBasketView } from './components/view/card/CardInBasketView';
import { BasketData } from './components/model/BasketData';
import { BasketView } from './components/view/basket/BasketView';
import { OrderFormView } from './components/view/form/OrderFormView';
import { ContactsFormView } from './components/view/form/ContactsFormView';
import { UserData } from './components/model/UserData';
import { SuccessOrderMessage } from './components/view/message/SuccessOrderMessage';

// Элемент галереи
const catalogElement = ensureElement<HTMLElement>('.gallery');

//  Элемент карточки в каталоге
const catalogCardElement = ensureElement<HTMLTemplateElement>('#card-catalog');

// Элемент выбранной карточки
const previewCardElement = ensureElement<HTMLTemplateElement>('#card-preview');

// Элемент карточки в корзине
const CardInBasketElement = ensureElement<HTMLTemplateElement>('#card-basket');

// Элемент модального окна
const modalElement = ensureElement<HTMLElement>('.modal');

// Элемент шапки
const headerElement = ensureElement<HTMLElement>('.header');

// Клонированный элемент корзины
const basketClonedElement = cloneTemplate<HTMLElement>(ensureElement<HTMLTemplateElement>('#basket'));

const successMessageElement = cloneTemplate(ensureElement<HTMLTemplateElement>('#success'));

const baseApi: IApi = new Api(API_URL);
const api = new AppApi(baseApi, CDN_URL);
const events = new EventEmitter();

// Классы данных
const catalogData = new CardsData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);

// Классы вью
const catalogView = new CatalogView(catalogElement, events);
const modalView = new ModalView(modalElement, events);
const headerView = new HeaderView(headerElement, events);
const basketView = new BasketView(basketClonedElement, events);
const succesMessageView = new SuccessOrderMessage(successMessageElement, events);

// Клон темплейта формы оплаты.
const orderFormElement = cloneTemplate<HTMLFormElement>(ensureElement<HTMLTemplateElement>('#order')) ;
const orderFormView = new OrderFormView(orderFormElement, events);

// Клон темплейта формы контактов
const contactsFormElement = cloneTemplate<HTMLFormElement>(ensureElement<HTMLTemplateElement>('#contacts'));
const contactsFormView = new ContactsFormView(contactsFormElement, events);

let lastSource: 'preview' | 'basket' | null = null;

// Загрузка массива карточек и сохраняет их в данные каталога
api.getProducts() 
.then((products) => { 
	catalogData.setItems(products); 
})
.catch((error) => {
	console.error(error);
})

// Создание элементов карточек
events.on(AppEvents.CardsSaved, () => {
	const productItems = catalogData.getItems().map((item) => { 
		const cardClonedElement = cloneTemplate<HTMLElement>(catalogCardElement);
		const cardView = new CardInCatalogView(cardClonedElement, events);
		return cardView.render(item);
	});
	// Добавление карточку в разметку.
	catalogView.content = productItems; 
});

// Вывод выбранной карточки в модальное окно.
events.on<{cardId: string}>(AppEvents.ProductOpen, (id) => {
		const previewCardClonedElement = cloneTemplate<HTMLElement>(previewCardElement);
		const previewCardView = new CardInPreviewView(previewCardClonedElement, events);
		const previewCardFilled =  previewCardView.render(catalogData.getItem(id.cardId)); 

	// Устанавка текста кнопки купить/удалить
	if(basketData.isItemInBasket(id.cardId)) { 
		previewCardView.setRemoveButtonText(); 
	}
	else {
		previewCardView.setBuyButtonText();
	}

	if(catalogData.getItem(id.cardId).price === null) { 
		previewCardView.render({buttonDisable: true});
	}

	// добавление карточку в модальное окно
	modalView.content = previewCardFilled;
	modalView.openModal();
})

// Слушатель события изменения корзины
events.on(AppEvents.BasketChanged, () => {

	// Создание массива корзинных html карточек
	const basketItems = basketData.getItems().map((item, index) => { 

		// Клон html шаблона карточки
		const cardInBasketCloned = cloneTemplate<HTMLElement>(CardInBasketElement);

		const cardInBasketView = new CardInBasketView(cardInBasketCloned, events);

		// Заполненный html элемент карточки
		const cardInBasketFilled = cardInBasketView.render(item);

		// номер карточки в корзине
		cardInBasketView.render({index: index});

		// Передача в рендер вью карточки данные карточки
		return cardInBasketView.render(item);
	})
	
	basketView.content = basketItems; 

	// Общая стоимость товара в корзине
	basketView.totalPrice = basketData.getTotalPrice();

	// Счетчик товаров
	headerView.counter = basketData.getItemsCount(); 

	// Валидация корзины 
	basketView.render({submitButtonDisable: basketData.isBasketEmpty()}); 

	if(lastSource === 'preview') {
		modalView.closeModal();
	}
	lastSource = null;
})

// Слушатель события открытия корзины
events.on(AppEvents.BasketOpen, ()=> {
	modalView.render({ content: basketView.render({submitButtonDisable: basketData.isBasketEmpty()}) }); 
	modalView.openModal();
})

// Слушатель клика по кнопке выбранной карточки
events.on(AppEvents.CardButtonClick, ({ id }: {id: string}) => {
	lastSource = 'preview';
	const selectedItem = catalogData.getItem(id); 
	if (basketData.isItemInBasket(id)) { 
		basketData.removeItem(id); 
	}
	else {
		basketData.addItem(selectedItem); 
	}
});

// Слушатель клика по кнопке удаления карточки в корзине
events.on(AppEvents.BasketDelete, ({id}: {id: string})=> {
	lastSource = 'basket';
	basketData.removeItem(id); 
})

// Слушатель сабмита корзины. Открывает форму оплаты.
events.on(AppEvents.BasketOrder, () => {
	modalView.render({ content: orderFormView.render({enableSubmit: false}) });
})

// Слушатель нажатия кнопки оплаты наличными
events.on<{ payment: TUserPayment }>(AppEvents.FormOrderCash, (payment) => {
	userData.setPayment(payment.payment)
	orderFormView.render({submitButtonDisable: userData.isOrderDataValid(), error: userData.getError()})
});

// Слушатель нажатия кнопки оплаты онлайн
events.on<{ payment: TUserPayment }>(AppEvents.FormOrderOnline, (payment) => {
	userData.setPayment(payment.payment);
	orderFormView.render({submitButtonDisable: userData.isOrderDataValid(), error: userData.getError()})
})

// Слушатель ввода в поле адреса
events.on<{address: string}>(AppEvents.FormOrderInput, (address) => {
	userData.setAddress(address.address);
	orderFormView.render({submitButtonDisable: userData.isOrderDataValid(), error: userData.getError()})
})

// Слушатель сохранения данных оплаты
events.on<{payment: TUserPayment}>(AppEvents.PaymentMethodSaved, (payment) => { 
	if (payment.payment === 'card') {
		orderFormView.activePaymentButton = true;
	}
	else {
		orderFormView.activePaymentButton = false;
	}
})

// Слушатель сабмита формы оплаты
events.on(AppEvents.FormOrderSubmit, () => {
	modalView.render({content: contactsFormView.render({submitButtonDisable: false})});
})

// Слушатель изменения поля email
events.on<{email: string}>(AppEvents.FormContactsInputEmail, (email)=> {
	userData.setEmail(email.email);
	contactsFormView.render({submitButtonDisable: userData.isContactsDataValid()})
})

// Слушатель изменения поля телефон
events.on<{phone: string}>(AppEvents.FormContactsInputPhone, (phone)=> {
	userData.setPhone(phone.phone);
	contactsFormView.render({submitButtonDisable: userData.isContactsDataValid()})
})

// Слушатель сабмита формы контактов
events.on(AppEvents.FormContactsSubmit, ()=> {
	const userOrderData = userData.getUserData();
	const totalPrice = basketData.getTotalPrice();
	const basketItemsIds = basketData.getItems().map((item)=> { 
		return item.id;
	})
	const fullOrderData = {
		...userOrderData,
		total: totalPrice,
		items: basketItemsIds
	}
	api.createOrder(fullOrderData) 
		.then((res) => {
			basketData.clearBasket(); 
			userData.clearData();
			contactsFormView.resetForm();
			orderFormView.resetForm();
			orderFormView.clearButtonState();
			modalView.render({content: succesMessageView.render({totalPrice: res.total})});
	});
})

// Слушатель сабмита сообщения об успешном заказе
events.on(AppEvents.OrderSuccessConfirm, ()=> { 
	modalView.closeModal();
})

events.on(AppEvents.ModalOpen, () => {
	catalogView.render({locked: true});
})

events.on(AppEvents.ModalClose, ()=> {
	catalogView.render({locked: false});
})