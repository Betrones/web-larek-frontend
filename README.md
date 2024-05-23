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

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Данные и типы данных в приложении

Карточка

```
export interface ICard {
  title: string,
  desc: string,
  id: string,
  category: string,
  image: string,
  price: number,
  inCart?: boolean
}
```

Покупатель

```
export interface ICustomer {
  payMethod: 'cash' | 'card',
  address: string,
  phone: string,
  email: string
}
```

Модель данных карточек

```
export interface ICardsData {
  gallery: ICard[],
  preview: string | null
}
```

Тип информации о покупателе из первой формы (выбор способа оплаты и адрес)

```
export type TCustomerOrderInfo = Pick<ICustomer, 'payMethod' | 'address'>
```

Тип информации о покупателе из второй формы (почта и телефон)

```
export type TCustomerContactInfo = Pick<ICustomer, 'email' | 'phone'>
```


## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP

- Model - Слой, отвечающий за хранение и изменение данных
- View - Слой, отвечающий  за отображение данных на странице
- Presenter - Слой, отвечающий за связь между слоями model и view

### Базовый код

#### Класс Api
Содержит базовую логику отправки запросов на сервер. В конструктор передается базовый url сервера и объект с заголовками запроса

Методы: 
- `get` - выполняет GET запрос на ендпоинт, указанный в параметрах, возвращает промис с ответом сервера
- `post` - принимает объект с данными (2 параметр), преобразует его в json и отправляет на ендпоинт (1 параметр), возвращает промис с ответом сервера. По умолчанию выполняется POST запрос, отднако он может быть изменен (3 параметр)

#### Класс EventEmitter
Брокер событий, позволяющий установить/снять обработчик на событие или инициировать событие с данными. Используется в слое presenter для обработки событий и в слоях приложения для генерации событий

Основные методы, реализуемые классом описываются в интерфейсе IEvents:

```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, генерирующую событие (указанное в параметрах) при вызове

### Слой данных

#### Класс CardsData

Класс отвечает за хранение и обработку данных о карточках, пришедших с сервера

В полях класса хранятся следующие данные:
- _gallery: ICard[] - массив объектов карточек
- events: IEvents - экземпляр класса EventEmitter для инициализации событий при изменении данных

Класс предоставляет набор методов для взаимодействия с этими данными:
- addCard(card: ICard): void - добавляет карточку в массив
- getCard(cardId: string): ICard - позволяет получить карточку по ее id
- addToCart(card: ICard): void - изменяет свойство inCart карточки, для отображения ее в корзине и блокировки кнопки в peview этой карточки
- removeFromCart(cardId: string): void - изменяет свойство inCart карточки по ее id для удаления из корзины
- Так же свойства `get` и `set` для добавления и получения данных из полей класса

#### Класс CustomerData
Класс отвечает за хранение и валидацию данных о пользователе

В полях класса хранятся следующие данные:
- payMethod: 'cash' | 'card' - способ оплаты
- address: string - адрес
- phone: string - номер телефона
- email: string - адрес электронной почты

Класс предоставляет следующие методы:

- getCustomerData(): ICustomer - возвращает объект с данными о покупателе
- setCustomerData(data: ICustomer): void - добавляет данные покупателя
- checkValidation(data: Record<keyof ICustomer, string>): boolean - проверяет валидность данных о пользователе
- Свойства `set` и `get` для добавления и получения данных из полей класса

#### Класс BasketData

Класс отвечает за хранение и обработку данных о корзине

В полях класса хранятся следующие данные:
- basketArr: ICard - массив карточек в корзине
- total - общая сумма заказа

### Классы представления

Классы представления отвечают за отображение внутри контейнера получаемых данных

#### Класс Modal
Реализует модальное окно. Предоставляет методы `openModal`, `closeModal` и `setContent` для управления отображением модального окна. Устанавливает слушатели на клик по кнопке закрытия модального окна или по оверлею для закрытия модального окна
- constructor (modalElementSelector: string, modalContentSelector: string, events: IEvents) - Конструктор принимает селекторы, по которым на странице будет найдено модальное окно и элемент, в котором будет находиться контент этого окна, а также экземпляр класса `EventEmitter` для возможности инициации событий

Методы класса:
- resetModal() - для сброса контента модального окна
- open/closeModal() - для заполнения/удаления контента модального окна

Поля класса:
- modal: HTMLElement - элемент модального окна
- modalContent: HTMLElement - дочерний элемент modal, в котором будет находиться контент модального окна
- events: IEvents - брокер событий
- closeBtn: HTMLButtonElement - кнопка закрытия модального окна

#### Класс Basket
Класс, предназначенный для создания модального окна basket
- constructor(template:HTMLTemplateElement, templateBasketItem: HTMLTemplateElement) конструктор принимает шаблон корзины и клонирует его, а также шаблон элемента товара в корзине и сохраняет его. Также находит элемент кнопки в разметке и сохраняет его

Поля класса:
- templateClone: HTMLElement
- basketList: HTMLElement - элемент списка корзины
- basketPrice: HTMLElement - общая цена товаров в корзине
- basketBtnL HTMLButtonElement - кнопка оформления заказа
- events: IEvents

Метод класса:
- addBasketItem(content: HTMLElement) - добавляет элемент карточки в список товаров
- setBasketTotal(total: number) - устанавливает общую цену товаров
- disable/enableBtn - включает/выключает кнопку оформления заказа
- resetBasket() - очищает список товаров
- render() - возвращает готовый шаблон корзины

#### Класс OrderModal
Класс, предназначенный для создания модального окна order и получения из него информации о покупателе по клику на кнопку
- constructor(template: HTMLTemplateElement, events: IEvents) - конструктор принимает шаблон элемента и клонирует его, а также находит элемент кнопки и сохраняет его и вешает слушатели на все кнопки

Поля класса:
- templateClone: HTMLElement - клон шаблона модального окна
- events: IEvents
- continueBtn - кнопка продолжения оформления заказа
- paymentChoose - элемент с кнопками выбора способа оплаты
- paymentButtons: HTMLButtonElement[] - список кнопок выбора способа оплаты
- _chosen: boolean - переменная, сохраняющая то, был ли выбран способ оплаты
- protected chosenBtn: HTMLButtonElement - выбранный способ оплаты
- protected cashBtn: HTMLButtonElement
- protected cardBtn: HTMLButtonElement
- protected _inputElement: HTMLElement - элемент ввода адреса

Методы класса:
- resetForm() - сбрасывает все значения формы
- resetButtons() - сбрасывает состояние кнопок выбора способа оплаты
- choseBtn() - выделяет выбранную кнопку способа оплаты
- enable/disableBtn() - включает/выключает кнопку продолжения оформления заказа
- render(): HTMLElement - возвращает клон шаблона модального окна
- getInfo(): Record<string, string> - возвращает объект с данными из полей формы

#### Класс ContactsModal
Класс, предназначенный для создания модального окна contacts и получения из него информации о покупателе по клику на кнопку
- constructor(template: HTMLTemplateElement, events: IEvents) - конструктор принимает шаблон элемента и клонирует его, находит элемент кнопки и сохраняет его, а также находит поля ввода

Поля класса:
- templateClone: HTMLElement - клон шаблона модального окна
- events: IEvents
- submitBtn: HTMLButtonElement - кнопка завершения заказа
- inputs: HTMLInputElement[] - массив инпутов
- inputPhone/inputEmail - элементы полей ввода телефона/почты

Методы класса:
- checkValid(): boolean - проверяет валидность данных в полях ввода
- resetForm(): void - сбрасывает данные в полях ввода
- enable/disableBtn - включает/выключает кнопку завершения заказа
- getInfo(): Record<string, string> - возвращает объект с данными из полей формы
- render(): HTMLElement - возвращает клон шаблона модального окна

#### Класс SuccessModal
Класс, предназначенный для создания модального окна успешной покупки
- constructor(template: HTMLElement, events: IEvents) - конструктор принимает шаблон элемента, клонирует его, находит кнопку закрытия модального окна и элемент суммарной стоимости покупки

Поля класса:
- templateClone: HTMLElement
- events: IEvents
- successDesc: HTMLSpanElement - элемент суммарной стоимости покупки
- endBtn: HTMLButtonElement - кнопка закрытия окна

Методы класса:
- setDesc(data: number): void - устаналвивает стоимость заказа
- render() - козвращает клон элемента


#### Класс Card
Класс для создания карточки из заданного шаблона
- constructor(template: HTMLTemplateElement, events: IEvents) - конструктор создает копию шаблона карточки и ставит слушатель на активную кнопку

Поля класса:
- templateClone
- _card: ICard - данная карточка
- title/price/category/description/image: HTMLElement - элементы с данными карточки в шаблоне
- events: IEvents

Методы:
- setCardData(cardData: ICard): void - заполняет атрибуты элементов карточки данными из параметра
- render(): HTMLElement - возвращает элемент карточки

#### Класс CardPreview
Класс для создания превью карточки в модальном окне

Метод класса:
- disableBtn(state: boolean) - метод для включения/выключения кнопки добавления в корзину

#### Класс CardCatalog
Класс для создания элемента карточки в галерее

#### Класс CardBasket
Класс для создания элемента карточки из массива

Методы класса:
- setIndex(index: number) - устанавливает номер карточки в корзине
- render()

#### Класс Basket
Класс для создания элемента корзины

Поля класса:
- templateClone: HTMLElement
- basketList: HTMLUListElement - элемент списка товаров в корзине
- basketPrice: HTMLSpanElement - элемент отображения суммарной стоимости заказа
- basketBtn: HTMLButtonElement - элемент кнопки оформления заказа
- events: IEvents

Методы класса:
- addBasketItem(content: HTMLElement): void - добавляет элемент, указанный в параметре, в список товаров в корзине
- setBasketTotal(total: number): void - устанавливает стоимость заказа
- disable/enableContinueBtn(): void - включает/выключает кнопка оформления заказа
- resetBasket(): void - очищает списов товаров в корзине
- render(): HTMLElement

## Взаимодействие компонентов

Код, описывающий взаимодействие слоев представления и данных находится в файле `./index.ts` выполняющем роль презентера

Взаимодействие осуществляется за счет событий, генирируемых с помощью брокера событий и обработчика этих событий, описанных в `index.ts`

### Список всех событий, которые могут генерироваться в системе
- `basket:addCard` - добавление карточки в корзину
- `basket:removeCard` - удаление карточки из корзины
- `basket:makeOrder` - нажатие на кнопку оформления заказа в корзине
- `order:inputChanged` - изменение данных в форме адреса
- `order:paymentChosen` - нажатие на кнопку выбора способа оплаты
- `order:continue` -  нажатие на кнопку продолжения оформления закза
- `order:reset` - сброс данных формы указания адреса и способа оплаты
- `contacts:inputChanged` - изменение данных в формах почты/телефона
- `contscts:submit` - нажатие на кнопку завершения заказа
- `end` - нажатеи на кнопку в модальном окне после завершения заказа