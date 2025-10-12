import { createApiUrl, createAuthHeaders, mapApiResponse } from './apiConfig'
import type { ApiError } from '../types'

class ApiException extends Error {
  public code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiException'
  }
}

const handleApiResponse = async <T>(response: Response, mapKey?: string): Promise<T> => {
  if (!response.ok) {
    try {
      const err = await response.json() as ApiError
      throw new ApiException(response.status, err.message || `Error ${response.status}`)
    } catch (e) {
      throw new ApiException(response.status, `Error ${response.status}: ${response.statusText}`)
    }
  }
  const contentType = response.headers.get('content-type') || ''
  if (response.status === 204 || !contentType.includes('application/json')) {
    // @ts-ignore
    return undefined
  }
  const data = await response.json()
  
  // Si se especifica una clave de mapeo, usamos el helper
  if (mapKey) {
    return mapApiResponse(data, mapKey) as T
  }
  
  return data
}

// NOTE: Backend endpoints for purchases/history may vary. Assumptions:
// - GET /api/purchases -> list of purchases (paged)
// - POST /api/purchases/{purchaseId}/restore -> restores/pending the associated shopping list

export const purchasesService = {
  async getPurchases(token: string, params?: Record<string, any>) {
    const qp = params ? '?' + new URLSearchParams(Object.entries(params).filter(([,v])=> v !== undefined && v !== null).map(([k,v])=> [k, String(v)])) : ''
    const response = await fetch(createApiUrl('/api/purchases') + qp, {
      method: 'GET',
      headers: createAuthHeaders(token)
    })

    return handleApiResponse<any>(response, 'purchases')
  },

  async restorePurchase(token: string, purchaseId: number) {
    const response = await fetch(createApiUrl(`/api/purchases/${purchaseId}/restore`), {
      method: 'POST',
      headers: createAuthHeaders(token)
    })

    return handleApiResponse<any>(response)
  }
,

  async getPurchase(token: string, purchaseId: number) {
    const response = await fetch(createApiUrl(`/api/purchases/${purchaseId}`), {
      method: 'GET',
      headers: createAuthHeaders(token)
    })

    return handleApiResponse<any>(response)
  }
}

export default purchasesService
