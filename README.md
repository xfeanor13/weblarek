# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды
npm install
npm run start

text

или
yarn
yarn start

text
## Сборка
npm run build

text

или
yarn build

text
## Данные и типы данных, используемые в приложении

**Способы оплаты**

```TypeScript
export type TUserPayment = 'card' | 'cash' | '';
Карточка товара

```TypeScript
export interface ICard {
id: string;
title: string;
image: string;
category: string;
price: number | null;
description: string;
}
Интерфейс класса данных каталога карточек

```TypeScript
export interface ICardsData {
setItems(items: ICard[]): void; 
getItems(): ICard[]; 
getItem(id: string): ICard; 
savePreview (cards: ICard[]): void; 
}
Данные покупателя

TypeScript
export interface IUser {
payment: TUserPayment
address: string;
email: string;
phone: string;
}
Интерфейс класса данных покупателя

TypeScript
export interface IUserData {
getUserData(): Partial<IUser>; 
validateUser(userData: IUser): boolean;
setPayment(method: TUserPayment): void; 
setAddress(address: string): void; 
setEmail(email: string): void; 
setPhone(phone: string): void; 
saveUser (userData: IUser): void; 
isOrderDataValid(): boolean;
isContactsDataValid(): boolean;
getError(): string;
clearData(): void;
}
Интерфейс класса данных корзины

TypeScript
export interface IBasketData {
Cards: ICard[]; 
addItem(item: ICard): void; 
removeItem(id: string): void; 
getTotalPrice(): number;
getItems(): ICard[]; 
isItemInBasket(id: string): boolean; 
getItemsCount(): number; 
isBasketEmpty(): boolean; 
clearBasket(): void; 
}
Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:

слой представления, отвечает за отображение данных на странице,

слой данных, отвечает за хранение и изменение данных

презентер, отвечает за связь представления и данных.

Базовый код
Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы:

get - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер

post - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом, описаны интерфейсом IEvents:

on - подписка на событие

emit - инициализация события

trigger - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

Слой данных
Класс CardsData
Класс отвечает за хранение и логику работы с данными карточек товаров.
Конструктор класса принимает инстанс брокера событий.

В полях класса хранятся следующие данные:

productItems: ICard[] - массив объектов карточек товаров 

preview: ICard - карточка, выбранная для просмотра в модальном окне

events: IEvents — экземпляр класса EventEmitter для инициации событий при изменении данных

Так же класс предоставляет набор методов для взаимодействия с этими данными:

getItems(): ICard[] - возвращает массив карточек товаров; 

setItems(items: ICard[]): void - сохраняет массив карточек товаров; 

getItem(id: string): ICard - возвращает карточку по её id; 

savePreview (cards: ICard[]): void - принимает и сохраняет инстанс карточки; 

saveCards (cards: ICard[]): void - сохраняет массив карточек; 

Класс UserData
Класс отвечает за хранение и валидацию данных текущего пользователя.
Конструктор класса принимает инстанс брокера событий
В полях класса хранятся следующие данные:

payment: TUserPayment - способ оплаты;

address: string - адрес;

email: string - email;

phone: string - номер телефона;

error: string - сообщение об ошибке;

Так же класс предоставляет набор методов для взаимодействия с этими данными:

getUserData(): Partial<IUser> - возвращает основные данные пользователя; 

validateUser(userData: IUser): boolean - валидирует данные пользователя;

setPayment(method: TUserPayment): void - устанавливает способ оплаты; 

setAddress(address: string): void - устанавливает адрес; 

setEmail(email: string): void - устанавливает email; 

setPhone(phone: string): void - устанавливает телефон; 

saveUser (userData: IUser): void - Принимает объект типа IUser, в котором все поля опциональные. Сохраняет данные пользователя; 

isOrderDataValid(): boolean - проверяет валидность данных заказа;

isContactsDataValid(): boolean - проверяет валидность контактных данных;

getError(): string - возвращает сообщение об ошибке;

clearData(): void - очищает данные пользователя;

Класс BasketData
Класс отвечает за хранение и обработку данных о товарах в корзине.
Конструктор класса принимает инстанс брокера событий.
В полях класса хранятся следующие данные:

basketItems: ICard[] - массив товаров в корзине; 

Cards: ICard[] - массив товаров; 

Так же класс предоставляет набор методов для взаимодействия с этими данными:

addItem(item: ICard): void - добавляет товар в корзину; 

removeItem(id: string): void - удаляет товар из корзину; 

getTotalPrice(): number - возвращает сумму товаров в корзине;

getItems(): ICard[] - возвращает массив товаров, добавленных в корзину; 

isItemInBasket(id: string): boolean - проверяет наличие товара в корзине по id товара; 

getItemsCount(): number - возвращает количество товаров в корзине; 

isBasketEmpty(): boolean - проверяет, пуста ли корзина; 

clearBasket(): void - очищает корзину; 

Слой представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

Базовый Класс Component
Класс является дженериком и родителем всех компонентов слоя представления.
В дженерик принимает тип объекта, в котором данные будут передаваться в метод render для отображения данных в компоненте. В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента. Содержит метод render, отвечающий за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

Класс HeaderView
Класс для отображения шапки приложения.
Содержит иконку корзины и отображает количество товаров, добавленных в корзину.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

basketButton: HTMLButtonElement

basketCounter: HTMLElement 

Методы класса:

set counter (itemsCount: number): void; 

Класс CatalogView
Класс для управления отображением каталога товаров.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.
Содержит метод для отрисовки каталога карточек товаров.

Поля класса:

pageWrapperElement: HTMLElement; 

Методы класса:

set content (items: HTMLElement[]): void; 

set locked(isOpen: boolean): void;

Класс ModalView
Класс для отображения модального окна.
Так же предоставляет методы open и close для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

closeButton: HTMLButtonElement;

contentContainer: HTMLElement; 

Методы класса:

openModal(): void;

closeModal(): void;

set content(element: HTMLElement): void;

Класс BasketView
Класс для отображения корзины товаров.
Содержит кнопку подтверждения оформления заказа, счетчик стоимости товаров в корзине.
Реализует методы отрисовки стоимости товаров в корзине.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

submitButtonElement: HTMLButtonElement;

totalPriceElement: HTMLElement; 

basketListElement: HTMLElement; 

Методы класса:

set content (items: HTMLElement[]): void; 

set totalPrice(totalPrice: number): void;

set submitButtonDisable(isEmpty: boolean): void;

Класс CardBaseView
Родительский класс для всех классов отображения карточки товара.
Содержит в себе функционал, который будут наследовать все дочерние классы представления карточки товара.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.
Содержит DOM элементы с названием и ценой товара и методы для установки текстового содержимого этих элементов.

Поля класса:

titleElement: HTMLElement; 

priceElement: HTMLElement; 

cardId: string;

events: IEvents;

Методы класса:

set title (text: string): void;

set price (price: number): void;

set id (id: string): void;

Класс CardFullView
Родительский класс для классов карточки в каталоге и карточки в превью.
Содержит DOM элемент с названием категории и ссылку на картинку карточки товара, а также методы для установки текстового содержимого категории и ссылки на картинку.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

categoryElement: HTMLElement; 

imageElement: HTMLImageElement; 

Методы класса:

set category (text: string): void;

set image (link: string): void;

Класс CardInCatalogView
Потомок класса CardFullView. Служит для отображения карточки товара в каталоге.
Содержит свойства и методы родительского класса.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Класс CardInPreviewView
Потомок класса CardFullView. Служит для отображения карточки товара в превью.
Содержит свойства и методы родительского класса, а также описание, кнопку действия и метод для установки текста описания.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

descriptionElement: HTMLElement; 

actionButton: HTMLButtonElement; 

Методы класса:

set description (text: string): void;

setRemoveButtonText(): void; 

setBuyButtonText(): void; 

set buttonDisable(value: boolean): void;

Класс CardInBasketView
Потомок класса CardBaseView. Служит для отображения карточки товара в корзине.
Содержит свойства и методы родительского класса, а также порядковый номер товара в корзине, кнопку удаления товара из корзины, метод установки порядкового номера товара в корзине.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

indexElement: HTMLElement;

deleteButton: HTMLButtonElement;

Методы класса:

set index (index: number): void;

Класс FormView
Родительский класс для всех классов отображения форм.\ 
Содержит в себе функционал, который будут наследовать дочерние классы представления форм.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

form: HTMLFormElement;

inputs: NodeListOf<HTMLInputElement>;

errorsElement: HTMLElement;

submitButton: HTMLButtonElement;

Методы класса:

onInputChange (): void; 

set errors (text: string): void; 

set valid (value: boolean): void; 

getInputsValue (): Record<string, string>; 

Класс BaseFormView
Родительский класс для всех классов отображения форм.
Содержит в себе функционал, который будут наследовать дочерние классы представления форм.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

container: HTMLFormElement;

inputsElement: NodeListOf<HTMLInputElement>;

errorsElement: HTMLElement;

submitButton: HTMLButtonElement;

Методы класса:

resetForm(): void;

Класс OrderFormView
Потомок класса BaseFormView. Служит для отображения формы выбора оплаты и адреса доставки.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

onlinePaymentButton: HTMLButtonElement; 

cashPaymentButton: HTMLButtonElement;

addressInput: HTMLInputElement; 

submitButton: HTMLButtonElement; 

errorContainer: HTMLElement; 

Методы класса:

set address (text: string): void;

set enableSubmit(value: boolean): void;

set submitButtonDisable(isValid: boolean): void;

set activePaymentButton(isOnline: boolean): void; 

set error(text: string): void;

clearButtonState(): void;

Класс ContactsFormView
Потомок класса BaseFormView. Служит для отображения формы сбора контактных данных: электронной почты и номера телефона.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

emailInput: HTMLInputElement; 

phoneInput: HTMLInputElement; 

submitButton: HTMLButtonElement; 

Методы класса:

set email (email: string): void;

set phone (phone: string): void;

set submitButtonDisable(isValid: boolean): void;

Класс OrderSuccesView
Класс для отображения сообщения об успешном оформлении заказа.\ 
Содержит итоговую стоимость купленных товаров, кнопку закрытия окна с сообщением и метода установки значения итоговой стоимости купленных товаров.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

totalPriceEl: HTMLElement; 

succesCloseButton: HTMLButtonElement; 

Методы класса:

set totalPrice (totalPrice: number): void; 

Класс SuccessOrderMessage
Класс для отображения сообщения об успешном оформлении заказа.
Содержит итоговую стоимость купленных товаров, кнопку закрытия окна с сообщением и метода установки значения итоговой стоимости купленных товаров.
Конструктор класса принимает container - контейнер с разметкой, в котором будет происходить поиск DOM элементов.

Поля класса:

totalPriceElement: HTMLElement;

closeButton: HTMLButtonElement; 

Методы класса:

set totalPrice (totalPrice: number): void;

Слой коммуникации
Класс AppApi
Класс предоставляет методы для работы с сервером веб приложения. В конструкторе принимает экземпляр базового класса Api и CDN URL.

В полях класса хранятся следующие данные:

_baseApi - экземпляр базового класса Api.

cdn - базовый URL CDN для изображений

Методы класса:

getProducts(): Promise<ICard[]> - получить с сервера массив товаров; 

createOrder(orderData: IOrder): Promise<IApiOrderResponse> - отправить на сервер сформированный заказ; 

Слой взаимодействия (презентер)
Взаимодействие слоев данных и представления происходит при помощи кода, который описан в корневом файле index.ts, выполняющий роль презентера. Такое взаимодействие осуществляется использованием брокера событий, который позволяет генерировать, а так же устанавливать на такие события обработчики, запускающие нужный код.
В файле index.ts сначала создаются необходимые экземпляры классов, а затем устанавливаются обработчики событий.

События слоя данных, которые могут генерироваться в веб приложении:

cards:saved - сохранение массива продуктов в слой данных;

basket:changed - изменение массива корзины товаров;

payment:methodSaved - сохранение метода оплаты; 

address:saved - сохранение адреса;

email:saved - сохранение email;

phone:saved - сохранение телефона;

События слоя представления, которые могут генерироваться в веб приложении:

modal:open - модальное окно открывается;

modal:close - модальное окно закрывается;

product:open - открывается модальное окно с превью продукта;

cardButton:click - нажата кнопка действия в окне превью;

basket:open - открывается модальное окно корзины товаров;

basket:delete - нажата кнопка удаления товара в корзине;

basket:order - нажата кнопка "Оформить" в корзине товаров;

formOrder:submit - отправка формы заказа с адресом доставки;

formContacts:submit - отправка формы с контактными данными;

formOrder:input - изменение данных в форме заказа с адресом доставки;

formContacts:input - изменение данных в форме с контактными данными;

formOrder:online - выбрана онлайн оплата;

formOrder:cash - выбрана оплата при получении;

orderSuccess:confirm - нажата кнопка завершения заказа; 