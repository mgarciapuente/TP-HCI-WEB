// Tipos relacionados con Shopping Lists (listas de compras)

export interface ShoppingListCreate {
  name: string
  description?: string
  recurring?: boolean
  metadata?: Record<string, any>
}

export interface ShoppingList {
  id: number
  name: string
  description?: string
  recurring: boolean
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
  owner?: {
    id: number
    name?: string
    surname?: string
    email?: string
  }
  sharedWith?: SharedUser[]
}

export interface ShoppingListUpdate {
  name?: string
  description?: string
  recurring?: boolean
  metadata?: Record<string, any>
}

export interface ListItem {
  id: number
  product: {
    id: number
    name?: string
    metadata?: Record<string, any>
  }
  quantity: number
  unit: string
  purchased?: boolean
  metadata?: Record<string, any>
}

export interface ListItemCreate {
  product: { id: number } | number
  quantity: number
  unit: string
  metadata?: Record<string, any>
}

export interface SharedUser {
  id: number
  name?: string
  surname?: string
  email?: string
}

export interface PagedListsResponse {
  data: ShoppingList[]
  total: number
  page: number
  per_page: number
}
