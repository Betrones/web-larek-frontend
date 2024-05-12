

class Customer {
  address: string;
  email: string;
  phone: string;
  paymentMethod: 'online' | 'offline'
  
  constructor() {

  }

  setOrderInfo(paymentMethod: any, address: string) {
    this.paymentMethod = paymentMethod;
    this.address = address
  }

  setCustomerInfo(email: string, phone: string) {
    this.email = email;
    this.phone = phone
  }
}