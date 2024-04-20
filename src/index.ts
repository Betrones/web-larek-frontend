import './scss/styles.scss';

import { Product, ProductCard, ProductPreview, Basket } from './types';

import { EventEmitter } from './components/base/events';
import { getProductsData, getProductData } from './utils/productApi';



const eventEmitter = new EventEmitter

const gallery: HTMLElement = document.querySelector('.gallery')
const productTemplate: HTMLTemplateElement = document.querySelector('#card-catalog')
const previewTemplate: HTMLTemplateElement = document.querySelector('#card-preview')
const basketTemplate:HTMLTemplateElement = document.querySelector('#basket')
const basketCardTemplate: HTMLTemplateElement = document.querySelector('#card-basket')
const modalContainer: HTMLElement = document.querySelector('#modal-container')
const modalClose: HTMLElement = document.querySelector('.modal__close')
const modalContent: HTMLElement = document.querySelector('.modal__content')
const headerBasketButton: HTMLElement = document.querySelector('.header__basket')

let productId: string

let basket: Basket



getProductsData()
.then((productsData: {items: Array<string & number>, total: number}) => {
  renderGallery(productsData.items)
  renderBasket()
})

function renderGallery(itemsArray: Array<string & number>) {
  itemsArray.forEach((item) => {
    const productCard = new ProductCard(productTemplate)

    productCard.render(item).querySelector('.gallery__item').addEventListener('click', () => {
      const productPreview = new ProductPreview(previewTemplate)
      modalContent.append(productPreview.show(item))
      productId = productCard.id
      openModal()

      const cardButton: HTMLElement = document.querySelector('.card__button')
      
      cardButton.addEventListener('click', updateBasket)
    })
    gallery.append(productCard.render(item))
  })
}

function updateBasket() {
  getProductData(productId)
  .then((resp: Product) => {
    basket.addProduct(resp)
  })
}

function renderBasket () {
  basket = new Basket(basketTemplate, basketCardTemplate)
}

headerBasketButton.addEventListener('click', () => {
  modalContent.textContent = ''
  modalContent.append(basket.show(basketTemplate))
  openModal()
})

modalClose.addEventListener('click', closeModal)

modalContainer.addEventListener('click', (ev)=> {
  if(ev.target == modalContainer) {
    closeModal()
  }
})

function openModal (): void {
  modalContainer.setAttribute('style', 'display: inline-block; position: absolute; z-index:1;')
} 

function closeModal (): void  {
  modalContainer.setAttribute('style', 'display: none')
  modalContent.textContent = ''
}
