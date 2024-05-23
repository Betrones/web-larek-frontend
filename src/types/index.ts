export interface ICard {
  title: string,
  description: string,
  id: string,
  category: string,
  image: string,
  price: number,
  inCart?: boolean // Отслеживание для блокировки кнопки в модальном окне preview карточки
}

export interface ICustomer {
  payMethod: string, // переписать документацию, т.к. с cash/card больше возни
  address: string,
  phone: string,
  email: string
}

export interface ICardsData {
  gallery: ICard[];
  addCard(card: ICard): void;
  getCard(cardId: string): ICard | undefined;
  addToCart(card: ICard): void;
  removeFromCart(cardId: string): void
}

export interface ICustomerData {
  getCustomerData(): ICustomer,
  setCustomerData(data: ICustomer): void
}

export type TCustomerOrderInfo = Pick<ICustomer, 'payMethod' | 'address'> // Тип информации о покупателе из первой формы

export type TCustomerContactInfo = Pick<ICustomer, 'email' | 'phone'> // Тип информации о покупателе из второй формы