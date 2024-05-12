import { IItem } from "../types";
import { ProductCard } from "./gallery";

interface IBasketModel {
  basketArr: IItem[],
  item: IItem,
  totalPrice: number,
  addItem(itemData: IItem): void
  removeItem(id: string): void
}

export class BasketModel implements IBasketModel{
  basketArr: IItem[];
  item: IItem;
  totalPrice: number;
  
  constructor() {
    this.basketArr = []
    this.totalPrice = 0
  }

  addItem(itemData: IItem): void {
    // console.log(this.basketArr)
    let item: IItem = {
      title: itemData.title,
      price: itemData.price,
      id: itemData.id,
    }
    
    this.basketArr.push(item)

    this.countTotalPrice()

    console.log(this.basketArr)
  }

  removeItem(id: string): void {
    this.basketArr = this.basketArr.filter(item => item.id !== id)
    this.countTotalPrice()
  }

  countTotalPrice() {
    this.totalPrice = 0
    this.basketArr.forEach(item => {
      this.totalPrice += item.price
    })
    return this.totalPrice
  }
}