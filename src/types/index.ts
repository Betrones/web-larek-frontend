interface IItem {
  category?: string, 
  description?: string, 
  id: string, 
  image?: string, 
  price: number | null, 
  title: string
  inCart?: boolean
}

export { IItem }