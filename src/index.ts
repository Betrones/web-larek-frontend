import './scss/styles.scss';
// import { ProductCard } from './components/gallery';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { ensureElement } from './utils/utils';
import { IItem } from './types';
import { GalleryModel } from './components/galleryModel';
import { itemPresenter } from './components/itemPresenter';
import { BasketModel } from './components/basketModel';


// const prod = new ProductCard(document.querySelector('#card-catalog'))

// console.log(prod)

const api = new Api(API_URL)

api.get('product')
.then((resp: {items: Array<IItem>, total: number}) => {
  // console.log(resp)
  const galleryData = new GalleryModel(resp.items)
  const basketData = new BasketModel()
  const presenter = new itemPresenter(galleryData.items, basketData)

  presenter.renderGallery()
  // console.log(galleryData.items)
})
