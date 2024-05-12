export interface ICard {
  title: string,
  desc: string,
  id: string,
  category: string,
  image: string,
  price: number,
  inCart?: boolean // Отслеживание для блокировки кнопки в модальном окне preview карточки
}

export interface ICustomer {
  payMethod: 'cash' | 'card',
  address: string,
  phone: string,
  email: string
}

export interface ICardsData {
  gallery: ICard[],
  preview: string | null,
  addCard(card: ICard): void,
  getCard(cardId: string): ICard,
  addToCart(card: ICard): void,
  removeFromCart(cardId: string): void
}

export interface ICustomerData {
  getCustomerData(): ICustomer,
  setCustomerData(data: ICustomer): void,
  checkValidation(data: Record<keyof ICustomer, string>): boolean
}

export type TGalleryCard = Pick<ICard, 'title' | 'category' | 'price' | 'image'> // Тип для карточки в галерее

export type TPreviewCard = Pick<ICard, 'title' | 'desc' | 'category' | 'image' | 'price' | 'inCart'> // Тип для превью карточки

export type TBasketCard = Pick<ICard, 'title' | 'price' | 'id'> // Тип карточки в корзине

export type TCustomerOrderInfo = Pick<ICustomer, 'payMethod' | 'address'> // Тип информации о покупателе из первой формы

export type TCustomerContactInfo = Pick<ICustomer, 'email' | 'phone'> // Тип информации о покупателе из второй формы