// import { IItem, ITemplate } from "./gallery";
import { IItem } from "../types";
import { cloneTemplate } from "../utils/utils";
import { ITemplate } from "./gallery";

interface ICustomer {
  paymentMethod: string;
  address: string;
  email: string;
  phone: string;
}



interface IBasket {
  render(price: number, content: string): HTMLElement,
}

interface IOrder {
  renderOrderForm(): HTMLDivElement,
  renderCustomerForm() : HTMLDivElement,
  renderSuccess(): HTMLDivElement

  // getOrderTemplate()
}

// class Basket {
//   constructor(template: HTMLTemplateElement) {

//   }
// }

export class Basket implements IBasket{
  template: ITemplate
  templateClone: ITemplate
  templateContent: HTMLElement

  totalPrice: HTMLElement
  orderBtn: HTMLElement

  constructor(template: ITemplate) {
    this.templateClone = cloneTemplate(template)
    this.totalPrice = this.templateClone.querySelector('.basket__price')
    this.orderBtn = this.templateClone.querySelector('.basket__button')
    this.templateContent = this.templateClone.querySelector('.basket__list')
  }

  render(price:number, content?: any) {
    if(!content) {
      this.orderBtn.setAttribute('disabled', 'true')
      this.templateContent.innerHTML = ''
    } else {
      this.orderBtn.removeAttribute('disabled')
      this.templateContent.innerHTML = content
    }

    this.totalPrice.textContent = `${price} синапсов`
    return this.templateClone
  }
}

export class BasketCard {
  item: IItem;
  templateClone: HTMLElement
  title: HTMLElement
  price: HTMLElement
  delBtn: HTMLElement
  cardNumber: HTMLElement

  constructor(template: ITemplate) {
    this.templateClone = cloneTemplate(template)
    this.title = this.templateClone.querySelector('.card__title')
    this.price = this.templateClone.querySelector('.card__price')
    this.delBtn = this.templateClone.querySelector('.card__button')
    this.cardNumber = this.templateClone.querySelector('.basket__item-index')
  }

  render(item: IItem, index: number) {
    this.item = item
    this.delBtn = this.templateClone.querySelector('.basket__item-delete')
    this.title.textContent = item.title
    this.price.textContent = `${item.price} синапсов`
    this.cardNumber.textContent = String(index)
    return this.templateClone
  }
}

class Order implements IOrder{
  customer: ICustomer

  constructor(orderInfoTemplate: ITemplate, customerInfoTemplate: ITemplate, successTemplate: ITemplate) {

  }

  renderOrderForm(): HTMLDivElement {
    return
  }

  renderCustomerForm(): HTMLDivElement {
    return
  }

  renderSuccess(): HTMLDivElement {
    return
  }
}