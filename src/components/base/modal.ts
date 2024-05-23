import { ensureElement } from "../../utils/utils";
import { IEvents } from "./events";


export class Modal {
  protected modal: HTMLElement
  protected modalContent: HTMLElement
  protected closeBtn: HTMLButtonElement
  protected events: IEvents

  constructor(modalElementSelector: string, modalContentSelector: string, events: IEvents) {
    this.modal = ensureElement(modalElementSelector)
    this.modalContent = ensureElement(modalContentSelector, this.modal)
    this.closeBtn = ensureElement('.modal__close', this.modal) as HTMLButtonElement
    this.events = events

    this.modal.addEventListener('click', (ev) => {
      if (ev.target == this.modal) {
        this.closeModal()
      } else if (ev.target == this.closeBtn) {
        this.closeModal()
      }
    })
  }

  get content () {
    return this.modalContent
  }

  resetModal() {
    this.modalContent.innerHTML = ''
  }

  openModal() {
    this.modal.classList.add('modal_active')
  }

  closeModal() {
    this.events.emit('modal:closed', this.modalContent)
    this.events.emit('order:reset')
    this.modal.classList.remove('modal_active')
    this.resetModal()
  }
}