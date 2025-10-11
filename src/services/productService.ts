import { createAuthHeaders, createApiUrl } from './apiConfig'
import type { ApiError } from '../types'

class ApiException extends Error {
  public code: number
  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiException'
  }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
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
  return await response.json()
}

export const productService = {
  async getProducts(token: string, params?: Record<string, any>) {
    const qp = params ? '?' + new URLSearchParams(Object.entries(params).filter(([,v])=> v !== undefined && v !== null).map(([k,v])=> [k, String(v)])) : ''
    const response = await fetch(createApiUrl('/api/products') + qp, {
      method: 'GET',
      headers: createAuthHeaders(token)
    })

    return handleApiResponse<any[]>(response)
  }
}

export default productService
