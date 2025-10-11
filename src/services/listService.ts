// Servicio para manejar las operaciones sobre Shopping Lists (listas de compras)

import type { ApiError } from '../types'
import type {
  ShoppingList,
  ShoppingListCreate,
  ShoppingListUpdate,
  ListItem,
  ListItemCreate,
  SharedUser,
  PagedListsResponse
} from '../types/listTypes'
import { API_CONFIG, createAuthHeaders, createApiUrl } from './apiConfig'

// Reusar la clase ApiException y el helper handleApiResponse del estilo de userService
export class ApiException extends Error {
  public code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiException'
  }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'Error en la solicitud'

    try {
      const errorData: ApiError = await response.json()
      errorMessage = errorData.message || `Error ${response.status}`
    } catch {
      errorMessage = `Error ${response.status}: ${response.statusText}`
    }

    throw new ApiException(response.status, errorMessage)
  }

  // Si no hay body (204) devolvemos undefined
  const contentType = response.headers.get('content-type') || ''
  if (response.status === 204 || !contentType.includes('application/json')) {
    // @ts-ignore
    return undefined
  }

  return await response.json()
}

export const listService = {
  // Editar cantidad y unidad de un item de la lista
  async updateListItem(token: string, listId: number, itemId: number, payload: { quantity: number, unit: string }): Promise<ListItem> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${listId}/items/${itemId}`),
      {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify(payload)
      }
    )
    return handleApiResponse<ListItem>(response)
  },
  // Eliminar un item de la lista
  async deleteListItem(token: string, listId: number, itemId: number): Promise<void> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${listId}/items/${itemId}`),
      {
        method: 'DELETE',
        headers: createAuthHeaders(token)
      }
    )
    return handleApiResponse<void>(response)
  },

  // Crear nueva lista
  async createList(token: string, payload: ShoppingListCreate): Promise<ShoppingList> {
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.LISTS.ROOT),
      {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(payload)
      }
    )

    return handleApiResponse<ShoppingList>(response)
  },

  // Obtener listas (con query params opcionales)
  async getLists(token: string, params?: Record<string, any>): Promise<PagedListsResponse | ShoppingList[]> {
    const qp = params ? '?' + new URLSearchParams(Object.entries(params).filter(([,v])=> v !== undefined && v !== null).map(([k,v])=> [k, String(v)])) : ''
    const response = await fetch(
      createApiUrl(API_CONFIG.ENDPOINTS.LISTS.ROOT) + qp,
      {
        method: 'GET',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<PagedListsResponse | ShoppingList[]>(response)
  },

  // Obtener una lista por id
  async getListById(token: string, id: number): Promise<ShoppingList> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}`),
      {
        method: 'GET',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<ShoppingList>(response)
  },

  // Actualizar lista
  async updateList(token: string, id: number, payload: ShoppingListUpdate): Promise<ShoppingList> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}`),
      {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify(payload)
      }
    )

    return handleApiResponse<ShoppingList>(response)
  },

  // Eliminar lista
  async deleteList(token: string, id: number): Promise<void> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}`),
      {
        method: 'DELETE',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<void>(response)
  },

  // Marcar lista como comprada (purchase)
  async purchaseList(token: string, id: number, payload?: { metadata?: object }): Promise<ShoppingList> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}/purchase`),
      {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(payload || {})
      }
    )

    return handleApiResponse<ShoppingList>(response)
  },

  // Resetear lista
  async resetList(token: string, id: number): Promise<ListItem[]> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}/reset`),
      {
        method: 'POST',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<ListItem[]>(response)
  },

  // Mover items de la lista a la despensa
  async moveToPantry(token: string, id: number): Promise<void> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}/move-to-pantry`),
      {
        method: 'POST',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<void>(response)
  },

  // Compartir lista con un email
  async shareList(token: string, id: number, email: string): Promise<void> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}/share`),
      {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify({ email })
      }
    )

    return handleApiResponse<void>(response)
  },

  // Obtener usuarios con los que se compartió la lista
  async getSharedUsers(token: string, id: number): Promise<SharedUser[]> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}/shared-users`),
      {
        method: 'GET',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<SharedUser[]>(response)
  },

  // Revocar acceso compartido
  async revokeShare(token: string, id: number, userId: number): Promise<void> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${id}/share/${userId}`),
      {
        method: 'DELETE',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<void>(response)
  }
  ,
  // Obtener items de una lista
  async getListItems(token: string, listId: number, params?: Record<string, any>): Promise<ListItem[] | any> {
    const qp = params ? '?' + new URLSearchParams(Object.entries(params).filter(([,v])=> v !== undefined && v !== null).map(([k,v])=> [k, String(v)])) : ''
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${listId}/items`) + qp,
      {
        method: 'GET',
        headers: createAuthHeaders(token)
      }
    )

    return handleApiResponse<ListItem[]>(response)
  },

  // Toggle purchased status for an item
  async toggleListItemPurchased(token: string, listId: number, itemId: number, purchased: boolean): Promise<ListItem> {
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${listId}/items/${itemId}`),
      {
        method: 'PATCH',
        headers: createAuthHeaders(token),
        body: JSON.stringify({ purchased })
      }
    )

    return handleApiResponse<ListItem>(response)
  }
,


  // Añadir un item a la lista
  async addListItem(token: string, listId: number, payload: ListItemCreate): Promise<ListItem> {
    const body = typeof payload.product === 'number' ? { ...payload, product: { id: payload.product } } : payload
    const response = await fetch(
      createApiUrl(`${API_CONFIG.ENDPOINTS.LISTS.ROOT}/${listId}/items`),
      {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify(body)
      }
    )

    return handleApiResponse<ListItem>(response)
  }

}
