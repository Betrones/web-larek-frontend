import { ICustomer, ICustomerData, TCustomerContactInfo, TCustomerOrderInfo } from "../../types";
import { IEvents } from "./events";

export class CustomerData implements ICustomerData {

  protected _customer: ICustomer = {
    payMethod: '',
    address: '',
    email: '',
    phone: ''
  }
  protected events: IEvents
  
  constructor(events: IEvents) {
    this.events = events
  }

  set userMethod(data: string) {
    this.customer.payMethod = data
  }

  set userAddress(data: string) {
    this.customer.address = data
  }

  set userMail(data: string) {
    this.customer.email = data
  }

  set userPhone(data: string) {
    this.customer.phone = data
  }

  get customer () {
    return this._customer
  }

  getCustomerData(): ICustomer {
    return this._customer
  }

  setCustomerData(data: ICustomer): void {
    this._customer = data
  }
}