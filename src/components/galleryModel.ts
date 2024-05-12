import { IItem } from "../types";
import { EventEmitter, IEvents } from "./base/events";

interface IGalleryModel {
  galleryArr: IItem[]
}

export class GalleryModel implements IGalleryModel {
  galleryArr: IItem[];
  constructor(arr: IItem[]) {
    this.galleryArr = arr
  }

  get items() {
    return this.galleryArr
  }
}