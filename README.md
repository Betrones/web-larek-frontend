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
export interface IGallery {
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