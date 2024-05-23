import { ICard, ICardsData } from "../../types";
import { IEvents } from "./events";

export class CardsData implements ICardsData {
  protected _gallery: ICard[];
  protected events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  get gallery () {
    return this._gallery
  }

  addCard(card: ICard): void {
    this._gallery = [card, ...this._gallery]
  }

  setCards(cards: ICard[]): void {
    this._gallery = cards
  }

  getCard(cardId: string): ICard {
    return this._gallery.find((elm) => elm.id == cardId)
  }

  addToCart(card: ICard): void {
    this._gallery.find((elm) => {
      if (elm == card) {
        elm.inCart = true
        this.events.emit('basket:changed')
      }
    })
  }

  removeFromCart(cardId: string): void {
    this._gallery.find((elm) => {
      if (elm.id == cardId) {
        elm.inCart = false
        this.events.emit('basket:changed')
      }
    })
  }
}