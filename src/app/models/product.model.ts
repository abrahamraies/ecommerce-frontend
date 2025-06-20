export interface Product {
  id: number
  title: string
  description: string
  price: number
  imageUrl: string
  isActive: boolean
  createdAt: Date
}

export interface CreateProduct {
  title: string
  description: string
  price: number
  file: File
  image?: File
}

export interface UpdateProduct {
  title: string
  description: string
  price: number
  isActive: boolean
  file?: File
  image?: File
}
