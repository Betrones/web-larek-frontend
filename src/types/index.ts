interface IItem {
  category: string, 
  description: string, 
  id: string, 
  image: string, 
  price: number | null, 
  title: string
}

export class Product {
  title: HTMLElement;
  category: HTMLElement;
  img: HTMLImageElement;
  price: HTMLElement;
  desc: HTMLElement;
  id: string;

  templateClone: HTMLElement

  constructor(template: HTMLTemplateElement) {
    this.templateClone = template.content.cloneNode(true) as HTMLElement

    this.title = this.templateClone.querySelector('.card__title')
    this.category = this.templateClone.querySelector('.card__category')
    this.img = this.templateClone.querySelector('.card__image')
    this.price = this.templateClone.querySelector('.card__price')
  }
}

export class ProductCard extends Product {

  constructor(template: HTMLTemplateElement ) {
    super(template)
  }

  render(item: IItem): HTMLElement {
    this.title.textContent = item.title
    this.category.textContent = item.category
    this.img.src = item.image

    if (typeof item.price === 'object') {
      this.price.textContent = `Бесценно`
    } else {
      this.price.textContent = `${String(item.price)} синапсов`
    }

    this.id = item.id

    return this.templateClone
  }
}


export class ProductPreview extends Product {

  constructor(template: HTMLTemplateElement) {
    super(template)

    this.desc = this.templateClone.querySelector('.card__text')
  }

  show(item: IItem): HTMLElement {

    this.title.textContent = item.title
    this.category.textContent = item.category
    this.img.src = item.image
    if (typeof item.price === 'object') {
      this.price.textContent = `Бесценно`
    } else {
      this.price.textContent = `${String(item.price)} синапсов`
    }
    this.desc.textContent = item.description

    this.id = item.id

    return this.templateClone
  }
}

export class Basket {
  products: Array<Product> = [] //Массив объектов в корзине
  totalPrice: number //Общая цена товаров (возможно будет строкой)

  templateClone: HTMLElement //Шаблон
  cardTemplateClone: HTMLElement
  cardTemplate: HTMLTemplateElement
  productList: HTMLElement //ul в разметке шаблона

  productCounter: number = 0
  headerBasketCounter: HTMLElement


  constructor (template: HTMLTemplateElement, cardTemplate: HTMLTemplateElement) {
    this.templateClone = template.content.cloneNode(true) as HTMLElement
    this.cardTemplate = cardTemplate

    this.productList = this.templateClone.querySelector('.basket__list')
    this.headerBasketCounter = document.querySelector('.header__basket-counter')
    this.headerBasketCounter.textContent = String(this.products.length)
  }

  addProduct(product: Product) {
    this.products.push(product)
    this.headerBasketCounter.textContent = String(this.products.length)
  }

  removeProduct(target: any) {

  }

  show(template: HTMLTemplateElement): HTMLElement {
    this.templateClone = template.content.cloneNode(true) as HTMLElement
    this.productList = this.templateClone.querySelector('.basket__list')


    if(this.products.length > 0) {
      this.productCounter = 0
      this.totalPrice = 0

      this.products.forEach((product) => {
        this.cardTemplateClone = this.cardTemplate.content.cloneNode(true) as HTMLElement

        this.productCounter += 1
        this.totalPrice += Number(product.price)

        this.cardTemplateClone.querySelector('.basket__item-index').textContent = String(this.productCounter)
        this.cardTemplateClone.querySelector('.card__title').textContent = String(product.title)
        this.templateClone.querySelector('.basket__price').textContent = `${String(this.totalPrice)} синапсов`

        if (typeof product.price === 'object') {
          this.cardTemplateClone.querySelector('.card__price').textContent = `Бесценно`
        } else {
          this.cardTemplateClone.querySelector('.card__price').textContent = `${String(product.price)} синапсов`
        }

        this.productList.append(this.cardTemplateClone)
      })
    }

    return this.templateClone
  }
}