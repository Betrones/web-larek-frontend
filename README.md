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

Тип для карточки в галерее

```
export type TGalleryCard = Pick<ICard, 'title' | 'category' | 'price' | 'image'>
```

Тип для превью карточки

```
export type TPreviewCard = Pick<ICard, 'title' | 'desc' | 'category' | 'image' | 'price' | 'inCart'>
```

Тип карточки в корзине

```
export type TBasketCard = Pick<ICard, 'title' | 'price' | 'id'>
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
- _preview: string | null - id карточки выбранной для отображения в модальном окне preview
- events: IEvents - экземпляр класса EventEmitter для инициализации событий при изменении данных

Класс предоставляет набор методов для взаимодействия с этими данными:
- addCard(card: ICard): void - добавляет карточку в массив
- getCard(cardId: string): ICard - позволяет получить карточку по ее id
- addToCart(card: ICard): void - изменяет свойство inCart карточки, для отображения ее в корзине и блокировки кнопки в peview этой карточки
- removeFromCart(cardId: string): void - изменяет свойство inCart карточки по ее id для удаления из корзины

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

### Классы представления

Классы представления отвечают за отображение внутри контейнера получаемых данных

#### Класс Modal
Реализует модальное окно. Предоставляет методы `openModal`, `closeModal` и `setContent` для управления отображением модального окна. Устанавливает слушатели на клик по кнопке закрытия модального окна или по оверлею для закрытия модального окна
- constructor (modalElementSelector: string, modalContentSelector: string, events: IEvents) - Конструктор принимает селекторы, по которым на странице будет найдено модальное окно и элемент, в котором будет находиться контент этого окна, а также экземпляр класса `EventEmitter` для возможности инициации событий

Поля класса:
- modal: HTMLElement - элемент модального окна
- modalContent: HTMLElement - дочерний элемент modal, в котором будет находиться контент модального окна
- events: IEvents - брокер событий

#### Класс ModalPreview
Класс, предназначенный для создания модального окна card-preview
- constructor(template: HTMLTemplateElement) - конструктор принимает шаблон модального окна и клонирует его

Поля класса:
- templateClone: HTMLElement - клон шаблона preview
- buyBtn: HTMLButtonElement - кнопка добавления в корзину данного товара

Метод класса:
- render(card: TPreviewCard): HTMLElement - заполняет поля шаблона данными объекта, переданного в параметрах и возвращает готовый элемент, для отображения на странице

#### Класс ModalBasket
Класс, предназначенный для создания модального окна basket
- constructor(template:HTMLTemplateElement, templateBasketItem: HTMLTemplateElement) конструктор принимает шаблон корзины и клонирует его, а также шаблон элемента товара в корзине и сохраняет его. Также находит элемент кнопки в разметке и сохраняет его

Поля класса:
- templateClone: HTMLElement
- templateBasketItem: HTMLTemplateElement - шаблон элемента товара в корзине, полученный в конструкторе
- templateBasketItemClone: HTMLElement - клон шаблона, создающийся в методе render этого класса
- orderBtn: HTMLButtonEleemnt - кнопка создания заказа из товаров в корзине

Метод класса:
- render(cart: string): HTMLElement - вставляет в разметку шаблона данные из параметра и возвращает готовый элемент корзины с товарами

#### Класс ModalOrder
Класс, предназначенный для создания модального окна order и получения из него информации о покупателе по клику на кнопку
- constructor(template: HTMLTemplateElement) - конструктор принимает шаблон элемента и клонирует его, а также находит элемент кнопки и сохраняет его

Поля класса:
- templateClone: HTMLElement - клон шаблона модального окна
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция полей ввода формы
- continueBtn: HTMLButtonElement - кнопка продолжения оформления заказа

Методы класса:
- render(): HTMLElement - возвращает клон шаблона модального окна
- setValid(isValid: boolean): void - изменяет активность кнопки
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, ключ - атрибут name инпута, а значение - введенные данные

#### Класс ModalContacts
Класс, предназначенный для создания модального окна contacts и получения из него информации о покупателе по клику на кнопку
- constructor(template: HTMLTemplateElement) - конструктор принимает шаблон элемента и клонирует его, находит элемент кнопки и сохраняет его, а также находит поля ввода

Поля класса:
- templateClone: HTMLElement - клон шаблона модального окна
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция полей ввода формы
- payBtn: HTMLButtonElement - кнопка завершения оформления заказа

Методы класса:
- render(): HTMLElement - возвращает клон шаблона модального окна
- setValid(isValid: boolean): void - изменяет активность кнопки
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, ключ - атрибут name инпута, а значение - введенные данные


#### Класс Card
Класс для создания карточки из заданного шаблона
- constructor(template: HTMLTemplateElement) - конструктор создает копию шаблона карточки и ставит слушатель на активную кнопку

Методы:
- setCardData(cardData: ICard): void - заполняет атрибуты элементов карточки данными из параметра
- render(): HTMLElement - возвращает элемент карточки