import { IItem } from "../types";
import { ensureElement } from "../utils/utils";
import { BasketModel } from "./basketModel";
import { ProductCard } from "./gallery";
import { Basket, BasketCard } from "./order";
import { PreviewModal } from "./preview";
// import { GalleryModel } from "./galleryModel";

export class itemPresenter {
  cardCatalogTemplate: HTMLTemplateElement;
  cardPreviewTemplate: HTMLTemplateElement;
  cardBasketTemplate: HTMLTemplateElement;
  basketTemplate: HTMLTemplateElement;
  orderTemplate: HTMLTemplateElement;
  contactsTemplate: HTMLTemplateElement;
  successTemplate: HTMLTemplateElement;

  galleryElement: HTMLElement;
  popupElement: HTMLElement;
  popupContent: HTMLElement
  closeBtn: HTMLButtonElement

  cartBtn: HTMLElement
  cartCounter: HTMLElement

  previewBtn: HTMLElement



  constructor( 
    protected galleryItems: IItem[],
    protected basketData: BasketModel
  ) {
    this.cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement
    this.cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement
    this.cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement
    this.basketTemplate = ensureElement('#basket') as HTMLTemplateElement
    this.orderTemplate = ensureElement('#order') as HTMLTemplateElement
    this.contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement
    this.successTemplate = ensureElement('#success') as HTMLTemplateElement

    this.popupElement = ensureElement('#modal-container')
    this.popupContent = this.popupElement.querySelector('.modal__content')
    this.closeBtn = this.popupElement.querySelector('.modal__close')

    
    this.popupElement.addEventListener('click', (ev) => {
      if (ev.target == this.popupElement) {
        this.closeModal()
      }
    })
    this.closeBtn.addEventListener('click', () => {this.closeModal()})

    this.galleryElement = ensureElement('.gallery')

    this.cartBtn = ensureElement('.header__basket')
    this.cartBtn.addEventListener('click', () => {this.renderBasket()})
    this.cartCounter = ensureElement('.header__basket-counter')
  }

  closeModal() {
    this.popupElement.classList.remove('modal_active')
    this.popupContent.innerHTML = ''
  }

  showModal() {
    this.popupElement.classList.add('modal_active')
  }

  renderGallery() {
    this.galleryItems.forEach(item => {
      const productCard = new ProductCard(this.cardCatalogTemplate)
      const productCardItem = productCard.render(item)

      productCardItem.addEventListener('click', (ev) => {this.renderPreview(ev, productCard)})
      // productCardItem.setAttribute('data-id', productCard.id)

      this.galleryElement.prepend(productCardItem)
      

      productCard.item = item
    });
  }

  renderPreview(ev: Event, productCard: ProductCard) {
    const previewModal = new PreviewModal(this.cardPreviewTemplate)
    const previewRenderItem = previewModal.render(productCard.item)
    

    this.popupContent.prepend(previewRenderItem)
    this.showModal()

    this.previewBtn = this.popupContent.querySelector('.card__button')

    this.previewBtn.addEventListener('click', (ev) => {
      this.addToCart(productCard.item)
      productCard.item.inCart = true

      this.closeModal()

      // this.previewBtn.textContent = 'В корзине'
      // this.previewBtn.setAttribute('disabled', 'true')
    })
  }

  addToCart(item: IItem) {
    this.basketData.addItem(item)
    this.cartCounter.textContent = String(this.basketData.basketArr.length)
  }

  removeFromCart(id: string) {
    this.basketData.removeItem(id)
    console.log(this.basketData)
  }

  renderBasket() {
    const basketModal = new Basket(this.basketTemplate)
    
    let cardCounter: number = 1
    let basketCards: string = ''

    this.basketData.basketArr.forEach(item => {

      const basketList = new BasketCard(this.cardBasketTemplate)
      const basketCard = basketList.render(item, cardCounter)
      
      basketCards += `<li class="basket__item card card_compact">${basketCard.innerHTML}</li>`

      cardCounter+=1

      // basketCards += basketList.render(item, cardCounter).innerHTML
      // console.log(basketList.render(item, cardCounter).innerHTML)
    })
    const renderedBasket = basketModal.render(this.basketData.countTotalPrice(), basketCards)
    this.popupContent.prepend(renderedBasket)

    this.popupContent.querySelectorAll('.basket__item-delete').forEach(item => {
      item.addEventListener('click', (ev: Event) => {
        // this.removeFromCart(basketList.item.id)
        // console.log((ev.target as HTMLElement).closest('.card'))
        console.log(item)
        // this.removeFromCart()
      })
    })
    
    
    

    this.showModal()
  }
}