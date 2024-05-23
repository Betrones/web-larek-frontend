import { ICard } from "../../types";


export class BasketData {
  protected basketArr: ICard[]
  protected total: number

  constructor () {
    this.basketArr = []
  }
  
  get basket () {
    return this.basketArr
  }

  addItem(card: ICard) {
    this.basketArr.push(card)
  }

  removeItem(card: ICard) {
    this.basketArr = this.basketArr.filter((elm) => elm.id != card.id)
  }

  getTotalPrice() {
    this.total = 0

    this.basketArr.forEach((elm) => {
      this.total += elm.price
    })

    return this.total
  }

  getBasketAmount () {
    return this.basketArr.length
  }

  getBasketItems () {
    let data: string[] = []
    this.basketArr.forEach((elm) => {
      data.push(elm.id)
    })

    return data
  }

  resetBasket() {
    this.basketArr = []
  }
}