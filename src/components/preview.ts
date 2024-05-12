import { cloneTemplate } from "../utils/utils";
import { IItem } from "../types";
import { CDN_URL } from "../utils/constants";

export class PreviewModal {

  templateClone: HTMLElement

  category: HTMLElement;
  image: HTMLImageElement;
  price: HTMLElement;
  title: HTMLElement
  desc: HTMLElement
  btn: HTMLElement

  constructor(template: HTMLTemplateElement) {
    this.templateClone = cloneTemplate(template)

    this.title = this.templateClone.querySelector('.card__title')
    this.price = this.templateClone.querySelector('.card__price')
    this.category = this.templateClone.querySelector('.card__category')
    this.image = this.templateClone.querySelector('.card__image')
    this.desc = this.templateClone.querySelector('.card__text')
    this.btn = this.templateClone.querySelector('.card__button')
  }

  render(data: IItem) {
    this.title.textContent = data.title
    if (data.price == null) {
      this.btn.setAttribute('disabled', 'true')
      this.price.textContent = 'Бесценно'
    } else {
      this.price.textContent = `${data.price} синапсов`
    }

    if (data.inCart == true) {
      this.btn.textContent = 'В корзине'
      this.btn.setAttribute('disabled', 'true')
    }
    this.category.textContent = data.category
    this.image.src = `${CDN_URL}${data.image}`
    this.desc.textContent = data.description

    return this.templateClone
  }
}