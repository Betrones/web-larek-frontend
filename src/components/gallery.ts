import { IItem } from "../types";
import { CDN_URL } from "../utils/constants";
import { cloneTemplate, ensureElement } from "../utils/utils";
import { EventEmitter, IEvents } from "./base/events";
import { GalleryModel } from "./galleryModel";

interface IGalery extends IEvents {
  render (item: IItem): HTMLElement;
}

type ITemplate = HTMLTemplateElement & HTMLElement

class ProductCard extends EventEmitter implements IGalery {
  item: IItem;
  templateClone: HTMLElement;

  templateContent: HTMLElement;

  category: HTMLElement;
  id: string;
  image: HTMLImageElement;
  price: HTMLElement;
  title: HTMLElement;
  description: string;

  buyButton: HTMLButtonElement

  constructor(template: ITemplate) {
    super()
    this.templateClone = cloneTemplate(template)

    this.templateContent = this.templateClone.querySelector('.card')

    this.title = this.templateClone.querySelector('.card__title')
    this.price = this.templateClone.querySelector('.card__price')
    this.category = this.templateClone.querySelector('.card__category')
    this.image = this.templateClone.querySelector('.card__image')
  }

  render(item: IItem): HTMLElement {
    this.title.textContent = item.title
    if (item.price == null) {
      this.price.textContent = 'Бесценно'
    } else {
      this.price.textContent = `${item.price} синапсов`
    }
    this.category.textContent = item.category
    this.image.src = `${CDN_URL}${item.image}`
    this.description = item.description

    return this.templateClone//productCard
  }
}

// class ProductPreview extends Product {
//   constructor(template: ITemplate) {
//     super(template)
//   }

//   render(item: IItem): HTMLElement {
//     this.title.textContent = item.title
//     this.price.textContent = String(item.price)
//     // this.id = item.id
//     this.description.textContent = item.description
//     this.category.textContent = item.category
//     this.image.src = item.image

//     return this.templateClone//productPreviewModal
//   }
// }

// export { ProductCard, ProductPreview, ITemplate }

// interface IGalery {
//   galleryElement: HTMLElement;
//   galleryItem: HTMLTemplateElement;
// }

// class Gallery implements IGalery {

//   galleryElement: HTMLElement;
//   galleryItem: HTMLTemplateElement;

//   constructor(itemTemplate: HTMLTemplateElement) {
//     this.galleryElement = ensureElement('.gallery')
//     this.galleryItem = cloneTemplate(itemTemplate)
//   }
// }

export { ProductCard, ITemplate }