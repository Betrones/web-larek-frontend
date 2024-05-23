import { Api } from './components/base/api';
import { Basket } from './components/base/basket';
import { BasketData } from './components/base/basketData';
import { CardBasket, CardCatalog, CardPreview } from './components/base/card';
import { CardsData } from './components/base/cardsData';
import { CustomerData } from './components/base/customerData';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/modal';
import { ContactsModal, OrderModal, SuccessModal } from './components/base/order';
import './scss/styles.scss';
import { ICard } from './types';
import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';

const cardCatalogTemplate = ensureElement('#card-catalog')
const cardPreviewTemplate = ensureElement('#card-preview')
const cardBasketTemplate = ensureElement('#card-basket')

const basketTemplate = ensureElement('#basket')

const orderTemplate = ensureElement('#order')
const contactsTemplate = ensureElement('#contacts')
const successModal = ensureElement('#success')

const events = new EventEmitter();

const cardsData = new CardsData(events);
const userData = new CustomerData(events);

const modal = new Modal('#modal-container', '.modal__content', events)

const gallery = ensureElement('.gallery')

const basketData = new BasketData()
const basketModal = new Basket(basketTemplate, events)
const basketButton = ensureElement('.header__basket')
const basketCounter = ensureElement('.header__basket-counter', basketButton)

const cardPreview = new CardPreview(cardPreviewTemplate, events)

const order = new OrderModal(orderTemplate as HTMLTemplateElement, events)
const contacts = new ContactsModal(contactsTemplate as HTMLTemplateElement, events)
const succcess = new SuccessModal(successModal as HTMLTemplateElement, events)

const api = new Api(API_URL)

events.on('basket:addCard', (ev) => {
  modal.closeModal()
  cardsData.addToCart(ev as ICard)
  basketData.addItem(ev as ICard)
  cardPreview.disableBtn(true)
  cardPreview.btn.textContent = 'В корзине'
  basketCounter.textContent = String(basketData.getBasketAmount())
})

events.on('basket:removeCard', (ev) => {
  cardsData.removeFromCart((ev as ICard).id)
  basketData.removeItem(ev as ICard)
  renderOnBasketBtn()
  basketCounter.textContent = String(basketData.getBasketAmount())
})

events.on('basket:makeOrder', () => {
  modal.resetModal()
  modal.content.prepend(order.render())
})

events.on('order:inputChanged', (ev) => {
  const event = ev as HTMLInputElement
  if (event.value != '' && order.chosen == true){
    order.enableBtn()
  } else {
    order.disableBtn()
  }
})

events.on('order:paymentChosen', (btn) => {
  order.resetButtons()
  order.choseBtn(btn as HTMLElement)
  events.emit('order:inputChanged', order.inputElement)
})

events.on('order:continue', () => {
  const info = order.getInfo()

  userData.userMethod = info.method
  userData.userAddress = info.address

  events.emit('order:reset')

  buildContactsModal()
})

events.on('order:reset', () => {
  order.resetForm()
  modal.resetModal()
})

events.on('contacts:inputChanged', () => {
  if (contacts.checkValid()) {
    contacts.enableBtn()
  } else {
    contacts.disableBtn()
  }
})

events.on('contacts:submit', () => {
  const info = contacts.getInfo()

  userData.userMail = info.email
  userData.userPhone = info.phone

  sendData()
})

events.on('end', () => {
  modal.closeModal()
})

api.get('/product/')
.then((resp: {items: ICard[], total: Number}) => {
  cardsData.setCards(resp.items)
})
.then(() => {
  cardsData.gallery.forEach((element) => {
    const cardCatalogElement = new CardCatalog(cardCatalogTemplate, events)

    cardCatalogElement.setCardData(element)
    const catalogElement = cardCatalogElement.render()

    catalogElement.addEventListener('click', () => {
      cardPreview.setCardData(element)

      modal.content.prepend(cardPreview.render())

      modal.openModal()
    })

    gallery.append(catalogElement)
  })
})

function renderOnBasketBtn() {
  basketModal.resetBasket()

  basketData.basket.forEach((elm, index) => {
    const basketItem = new CardBasket(cardBasketTemplate, events)

    basketItem.setCardData(elm)
    basketItem.setIndex(index+1)

    const item = basketItem.render()
    basketModal.basketContent.append(item)
  })

  basketModal.setBasketTotal(basketData.getTotalPrice())
  if(basketData.getTotalPrice() == 0) {
    basketModal.disableContinueBtn()
  } else {
    basketModal.enableContinueBtn()
  }

  modal.content.prepend(basketModal.render())
  modal.openModal()
}

function buildContactsModal() {
  modal.content.prepend(contacts.render())
  modal.openModal()
}

function buildFinalModal() {
  succcess.setDesc(basketData.getTotalPrice())
  modal.content.prepend(succcess.render())
}

function setData() {
  const data = {
    "payment": userData.customer.payMethod,
    "email": userData.customer.email,
    "phone": userData.customer.phone,
    "address": userData.customer.address,
    "total": basketData.getTotalPrice(),
    "items": basketData.getBasketItems()
  }

  return data
}

function sendData() {
  api.post('/order', setData())
  .then(() => {
    basketCounter.textContent = '0'
    events.emit('order:reset')
    contacts.resetForm()
    buildFinalModal()
    basketData.resetBasket()
  })
}


basketButton.addEventListener('click', renderOnBasketBtn)