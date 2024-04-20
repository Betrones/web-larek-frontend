import { Api } from "../components/base/api";
import { API_URL } from "./constants";

const api = new Api(API_URL)

const getProductsData = () => {
  return api.get('product')
  .then((resp) => {
    // console.log(resp)
    return(resp)
  })
}

const getProductData = (id: string) => {
  return api.get(`product/${id}`)
  .then((resp) => {return resp})
}

export{ getProductsData, getProductData }