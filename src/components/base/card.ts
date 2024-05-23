import { ICard } from "../../types"
import { CDN_URL } from "../../utils/constants"
import { cloneTemplate, ensureElement } from "../../utils/utils"
import { IEvents } from "./events"

abstract class Card {
  protected templateClone: HTMLElement

  protected _card: ICard

  protected title: HTMLElement
  protected price: HTMLElement

  protected category?: HTMLElement
  protected description?: HTMLElement
  protected image?: HTMLImageElement

  protected events: IEvents

  constructor (template: HTMLElement, events: IEvents) {
    this.templateClone = cloneTemplate(template as HTMLTemplateElement)

    this.title = ensureElement('.card__title', this.templateClone)
    this.price = ensureElement('.card__price', this.templateClone)

    this.events = events
  }

  setCardData(cardData: ICard): void {
    this.title.textContent = cardData.title

    this._card = cardData

    if (cardData.price == null) {
      this.price.textContent = `Бесценно`
    } else {
      this.price.textContent = `${cardData.price} синапсов`
    }

    if (this.category) {
      this.category.textContent = cardData.category
    }

    if (this.image) {
      this.image.src = `${CDN_URL}${cardData.image}`
    }
  }

  render(): HTMLElement {
    return this.templateClone
  }
}

export class CardPreview extends Card {
  protected basketBtn: HTMLElement

  constructor(template: HTMLElement, events: IEvents) {
    super(template, events)

    this.description = ensureElement('.card__text', this.templateClone)
    this.image = ensureElement('.card__image', this.templateClone) as HTMLImageElement
    this.category = ensureElement('.card__category', this.templateClone)

    this.basketBtn = ensureElement('.card__button', this.templateClone)

    if (this.price.textContent == 'Бесценно') {
      this.basketBtn.setAttribute('disabled', 'true')
    }

    this.basketBtn.addEventListener('click', ()=>{
      events.emit('basket:addCard', this._card)
    })
  }

  get btn () {
    return this.basketBtn
  }

  setCardData(cardData: ICard): void {
    this.title.textContent = cardData.title
    this._card = cardData

    if (this._card.price == null) {
      this.price.textContent = `Бесценно`
      this.disableBtn(true)
    } else {
      this.price.textContent = `${this._card.price} синапсов`
      this.disableBtn(false)
    }

    if (this._card.inCart == true) {
      this.disableBtn(true)
      this.basketBtn.textContent = 'В корзине'
    } else {
      this.basketBtn.textContent = 'В корзину'
    }

    if (this.category) {
      this.category.textContent = this._card.category
    }

    if (this.description) {
      this.description.textContent = this._card.description
    }

    if (this.image) {
      this.image.src = `${CDN_URL}${this._card.image}`
    }
  }

  disableBtn(state: boolean): void {
    if (state == true) {
      this.basketBtn.setAttribute('disabled', 'true')
    } else {
      this.basketBtn.removeAttribute('disabled')
    }
  }
}

export class CardCatalog extends Card {
  constructor(template: HTMLElement, events: IEvents) {
    super(template, events)
    this.category = ensureElement('.card__category', this.templateClone)
    this.image = ensureElement('.card__image', this.templateClone) as HTMLImageElement
  }
}

export class CardBasket extends Card {
  protected delBtn: HTMLElement
  protected basketItemCounter: HTMLElement

  constructor(template: HTMLElement, events: IEvents) {
    super(template, events)

    this.delBtn = ensureElement('.basket__item-delete', this.templateClone)

    this.basketItemCounter = ensureElement('.basket__item-index', this.templateClone)

    this.delBtn.addEventListener('click', ()=>{this.events.emit('basket:removeCard', this._card)})
  }

  get counter() {
    return this.basketItemCounter
  }

  get deleteBtn () {
    return this.delBtn
  }

  setIndex(index: number): void {
    this.basketItemCounter.textContent = String(index)
  }

  render(): HTMLElement {
    return this.templateClone
  }
}