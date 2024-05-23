import { cloneTemplate, ensureElement } from "../../utils/utils"
import { IEvents } from "./events"

export class Basket {
  protected templateClone: HTMLElement
  protected basketList: HTMLUListElement
  protected basketPrice: HTMLSpanElement
  protected basketBtn: HTMLButtonElement
  protected events: IEvents

  constructor(template: HTMLElement, events: IEvents) {
    this.templateClone = cloneTemplate(template as HTMLTemplateElement)
    this.events = events

    this.basketList = ensureElement('.basket__list', this.templateClone) as HTMLUListElement
    this.basketPrice = ensureElement('.basket__price', this.templateClone)
    this.basketBtn = ensureElement('.basket__button', this.templateClone) as HTMLButtonElement
    this.basketList.textContent = ''

    this.basketBtn.addEventListener('click', () => {this.events.emit('basket:makeOrder')})
  }

  get basketContent() {
    return this.basketList
  }

  addBasketItem(content: HTMLElement): void {
    this.basketList.append(content)
  }

  setBasketTotal(total: number): void {
    this.basketPrice.textContent = `${String(total)} синапсов`
  }

  disableContinueBtn(): void {
    this.basketBtn.setAttribute('disabled', 'true')
  }

  enableContinueBtn(): void {
    this.basketBtn.removeAttribute('disabled')
  }

  resetBasket(): void {
    this.basketList.innerHTML = ''
  }

  render(): HTMLElement {
    return this.templateClone
  }
}