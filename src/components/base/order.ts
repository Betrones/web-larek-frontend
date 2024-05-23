import { cloneTemplate, ensureAllElements, ensureElement } from "../../utils/utils"
import { IEvents } from "./events"


export class OrderModal {
  protected templateClone: HTMLElement
  protected events: IEvents

  protected continueBtn: HTMLButtonElement

  protected paymentChoose: HTMLElement
  protected paymentButtons: HTMLButtonElement[]
  protected _chosen: boolean = false
  protected chosenBtn: HTMLButtonElement
  protected cashBtn: HTMLButtonElement
  protected cardBtn: HTMLButtonElement
  protected _inputElement: HTMLInputElement

  protected paymentMethod: string
  protected inputText: string

  constructor(template: HTMLTemplateElement, events: IEvents) {
    this.templateClone = cloneTemplate(template)

    this.events = events

    this.paymentChoose = ensureElement('.order__buttons', this.templateClone)
    this._inputElement = ensureElement('.form__input', this.templateClone) as HTMLInputElement

    this.continueBtn = ensureElement('.order__button', this.templateClone) as HTMLButtonElement
    this.continueBtn.addEventListener('click', (ev) => {
      ev.preventDefault()
      this.events.emit('order:continue')
    })

    this._inputElement.addEventListener('input', (ev) => {
      events.emit('order:inputChanged', this._inputElement)
    })

    this.paymentButtons = ensureAllElements('.button_alt', this.paymentChoose)
    this.paymentButtons.forEach((btn) => {
      if (btn.name == 'card') {
        this.cardBtn = btn
      } else if (btn.name == 'cash') {
        this.cashBtn = btn
      }

      btn.addEventListener('click', () => {
        this.events.emit('order:paymentChosen', btn)
      })
    })
  }

  get input() {
    return this._inputElement
  }
  
  get chosen() {
    return this._chosen
  }

  get inputElement() {
    return this._inputElement
  }

  resetForm(): void {
    this._inputElement.value = ''
    this.resetButtons()
    this.disableBtn()
  }

  resetButtons(): void {
    this.paymentButtons.forEach((btn) => {
      btn.classList.remove('button_alt-active')
    })
    this._chosen = false
  }

  choseBtn(btn: HTMLElement): void {
    btn.classList.add('button_alt-active')
    this.chosenBtn = btn as HTMLButtonElement
    this._chosen = true
  }

  enableBtn(): void {
    this.continueBtn.removeAttribute('disabled')
  }

  disableBtn(): void {
    this.continueBtn.setAttribute('disabled', 'true')
  }

  getInfo(): Record<string, string> {
    return {
      method: this.chosenBtn.name,
      address: this._inputElement.value
    }
  }

  render(): HTMLElement {
    return this.templateClone
  }
}

export class ContactsModal {
  protected templateClone: HTMLElement
  protected events: IEvents

  protected submitBtn: HTMLButtonElement

  protected inputs: HTMLInputElement[]
  protected inputPhone: HTMLInputElement
  protected inputEmail: HTMLInputElement

  constructor (template:HTMLTemplateElement, events: IEvents) {
    this.templateClone = cloneTemplate(template)
    this.events = events

    this.submitBtn = ensureElement('button', this.templateClone) as HTMLButtonElement

    this.inputs = ensureAllElements('.form__input', this.templateClone)
    this.inputEmail = this.inputs[0]
    this.inputPhone = this.inputs[1]
    this.inputs.forEach((elm) => {
      // if (elm.name = 'email') {
      //   this.inputEmail = elm
      // } else if (elm.name = 'phone') {
      //   this.inputPhone = elm
      // } почему то у обоих инпутов имя email в браузере

      elm.addEventListener('input', () => {
        this.events.emit('contacts:inputChanged')
      })
    })

    this.submitBtn.addEventListener('click', (ev) => {
      ev.preventDefault()
      this.events.emit('contacts:submit')
    })
  }

  checkValid(): boolean {
    if (this.inputEmail.value != '' && this.inputPhone.value != '') {
      return true
    }
  }

  resetForm(): void {
    this.inputs.forEach((elm) => {
      (elm as HTMLInputElement).value = ''
    })
    this.disableBtn()
  }

  enableBtn(): void {
    this.submitBtn.removeAttribute('disabled')
  }

  disableBtn(): void {
    this.submitBtn.setAttribute('disabled', 'true')
  }

  getInfo(): Record<string, string> {
    return {
      email: this.inputEmail.value,
      phone: this.inputPhone.value
    }
  }

  render(): HTMLElement {
    return this.templateClone
  }
}

export class SuccessModal {
  protected templateClone: HTMLElement
  protected events: IEvents

  protected successDesc: HTMLSpanElement
  protected endBtn: HTMLButtonElement

  constructor(template: HTMLElement, events: IEvents) {
    this.templateClone = cloneTemplate(template as HTMLTemplateElement)
    this.events = events

    this.successDesc = ensureElement('.order-success__description', this.templateClone)
    this.endBtn = ensureElement('.order-success__close', this.templateClone) as HTMLButtonElement
    this.endBtn.addEventListener('click', () => {this.events.emit('end')})
  }

  setDesc(data: number): void {
    this.successDesc.textContent = `Списано ${data} синапсов`
  }

  render() {
    return this.templateClone
  }
}