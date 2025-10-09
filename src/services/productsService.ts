import { API_CONFIG, createApiUrl, createAuthHeaders } from './apiConfig'

export interface Category {
  id: number
  name: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
  category: Category
}

export interface ProductsResponse {
  products: Product[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface CreateProductRequest {
  name: string
  category: {
    id: number
  }
  metadata: Record<string, any>
}

// Servicio para productos
export const productsService = {
  // Obtener productos con filtros opcionales
  async getProducts(
    params: {
      name?: string
      category_id?: number
      page?: number
      per_page?: number
      sort_by?: string
      order?: string
    } = {},
    token?: string
  ) {
    const searchParams = new URLSearchParams()
    
    // Agregar parámetros solo si tienen valor
    if (params.name) searchParams.append('name', params.name)
    if (params.category_id) searchParams.append('category_id', params.category_id.toString())
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    if (params.order) searchParams.append('order', params.order)
    
    const url = `${createApiUrl('/api/products')}?${searchParams.toString()}`
    
    const headers = token ? createAuthHeaders(token) : API_CONFIG.DEFAULT_HEADERS
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener productos')
    }
    
    const data = await response.json()
    
    // Verificar si la respuesta es un array directo o un objeto con estructura
    if (Array.isArray(data)) {
      // La API devuelve un array directo
      return {
        products: data,
        totalCount: data.length,
        totalPages: 1,
        currentPage: 1
      } as ProductsResponse
    } else {
      // La API devuelve un objeto con estructura
      return data as ProductsResponse
    }
  },

  // Crear nuevo producto
  async createProduct(productData: CreateProductRequest) {
    const response = await fetch(createApiUrl('/api/products'), {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      throw new Error('Error al crear producto')
    }
    
    return response.json() as Promise<Product>
  }
}

export interface CreateCategoryRequest {
  name: string
  metadata: Record<string, any>
}

// Servicio para categorías
export const categoriesService = {
  // Obtener todas las categorías
  async getCategories(
    params: {
      name?: string
      page?: number
      per_page?: number
      order?: string
      sort_by?: string
    } = {},
    token?: string
  ) {
    const searchParams = new URLSearchParams()
    
    // Agregar parámetros solo si tienen valor
    if (params.name) searchParams.append('name', params.name)
    if (params.page) searchParams.append('page', params.page.toString())
    if (params.per_page) searchParams.append('per_page', params.per_page.toString())
    if (params.order) searchParams.append('order', params.order)
    if (params.sort_by) searchParams.append('sort_by', params.sort_by)
    
    const url = `${createApiUrl('/api/categories')}?${searchParams.toString()}`
    
    const headers = token ? createAuthHeaders(token) : API_CONFIG.DEFAULT_HEADERS
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      throw new Error('Error al obtener categorías')
    }
    
    const data = await response.json()
    
    // Verificar si la respuesta es un array directo o un objeto con estructura
    if (Array.isArray(data)) {
      // La API devuelve un array directo
      return {
        categories: data,
        totalCount: data.length,
        totalPages: 1,
        currentPage: 1
      }
    } else {
      // La API devuelve un objeto con estructura
      return data
    }
  },

  // Crear nueva categoría
  async createCategory(categoryData: CreateCategoryRequest) {
    const response = await fetch(createApiUrl('/api/categories'), {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify(categoryData)
    })
    
    if (!response.ok) {
      throw new Error('Error al crear categoría')
    }
    
    return response.json() as Promise<Category>
  }
}