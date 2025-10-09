// Ya no necesitamos importar los servicios porque usamos fetch directo

// Categorías predeterminadas para nuevos usuarios
const DEFAULT_CATEGORIES = [
  { name: 'Lácteos', metadata: {} },
  { name: 'Carnes', metadata: {} },
  { name: 'Verduras', metadata: {} },
  { name: 'Frutas', metadata: {} },
  { name: 'Panadería', metadata: {} },
  { name: 'Bebidas', metadata: {} },
  { name: 'Condimentos', metadata: {} },
  { name: 'Congelados', metadata: {} }
]

// Productos de muestra para cada categoría
const SAMPLE_PRODUCTS = [
  // Lácteos
  { name: 'Leche entera', categoryName: 'Lácteos' },
  { name: 'Queso cremoso', categoryName: 'Lácteos' },
  { name: 'Yogur natural', categoryName: 'Lácteos' },
  
  // Carnes
  { name: 'Pollo entero', categoryName: 'Carnes' },
  { name: 'Carne picada', categoryName: 'Carnes' },
  
  // Verduras
  { name: 'Tomate', categoryName: 'Verduras' },
  { name: 'Lechuga', categoryName: 'Verduras' },
  { name: 'Cebolla', categoryName: 'Verduras' },
  
  // Frutas
  { name: 'Manzana', categoryName: 'Frutas' },
  { name: 'Banana', categoryName: 'Frutas' },
  
  // Panadería
  { name: 'Pan de mesa', categoryName: 'Panadería' },
  { name: 'Facturas', categoryName: 'Panadería' },
  
  // Bebidas
  { name: 'Agua mineral', categoryName: 'Bebidas' },
  { name: 'Jugo de naranja', categoryName: 'Bebidas' },
  
  // Condimentos
  { name: 'Sal', categoryName: 'Condimentos' },
  { name: 'Aceite', categoryName: 'Condimentos' },
  
  // Congelados
  { name: 'Helado', categoryName: 'Congelados' },
  { name: 'Hamburguesas', categoryName: 'Congelados' }
]

export const userInitializationService = {
  /**
   * Inicializa las categorías y productos predeterminados para un nuevo usuario
   * Debe llamarse después del registro exitoso
   */
  async initializeUserData(token?: string): Promise<boolean> {
    try {
      console.log('� Configurando categorías y productos iniciales...')
      
      // Paso 1: Crear categorías predeterminadas
      const createdCategories = []
      
      for (const categoryData of DEFAULT_CATEGORIES) {
        try {
          // Crear categoría usando el endpoint POST /api/categories (CON TOKEN)
          const headers: Record<string, string> = {
            'Content-Type': 'application/json'
          }
          
          if (token) {
            headers['Authorization'] = `Bearer ${token}`
          }
          
          const response = await fetch('http://localhost:8080/api/categories', {
            method: 'POST',
            headers,
            body: JSON.stringify(categoryData)
          })
          
          if (response.ok) {
            const category = await response.json()
            createdCategories.push(category)
            console.log(`✅ Categoría: ${category.name}`)
          } else if (response.status === 409) {
            // Si la categoría ya existe, intentar obtenerla silenciosamente
            try {
              const getCatResponse = await fetch(`http://localhost:8080/api/categories?name=${encodeURIComponent(categoryData.name)}`, {
                method: 'GET',
                headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }
              })
              if (getCatResponse.ok) {
                const catData = await getCatResponse.json()
                if (Array.isArray(catData) && catData.length > 0) {
                  createdCategories.push(catData[0])
                } else if (catData.categories && catData.categories.length > 0) {
                  createdCategories.push(catData.categories[0])
                }
              }
            } catch (error) {
              // Silenciar errores de categorías existentes
            }
          }
        } catch (error) {
          // Silenciar errores de categorías
        }
      }

      // Paso 2: Crear productos de muestra
      const categoryMap = new Map(
        createdCategories.map(cat => [cat.name, cat])
      )

      for (const productData of SAMPLE_PRODUCTS) {
        try {
          const category = categoryMap.get(productData.categoryName)
          
          if (category) {
            // Crear producto usando fetch directo (CON TOKEN)
            const headers: Record<string, string> = {
              'Content-Type': 'application/json'
            }
            
            if (token) {
              headers['Authorization'] = `Bearer ${token}`
            }
            
            const response = await fetch('http://localhost:8080/api/products', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                name: productData.name,
                category: {
                  id: category.id
                },
                metadata: {}
              })
            })
            
            if (response.ok) {
              const product = await response.json()
              console.log(`✅ Producto: ${product.name}`)
            }
          }
        } catch (error) {
          // Silenciar errores de productos
        }
      }

      console.log('✅ Configuración inicial completada')
      return true

    } catch (error) {
      console.error('Error durante la inicialización:', error)
      return false
    }
  },

  /**
   * Verifica si el usuario ya tiene datos inicializados
   */
  async checkIfUserHasData(token?: string): Promise<boolean> {
    try {
      // Verificar si hay productos (no solo categorías) usando fetch con token
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch('http://localhost:8080/api/products?per_page=1', {
        method: 'GET',
        headers
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // La API puede devolver un array directo o un objeto con totalCount
        let productCount = 0
        if (Array.isArray(data)) {
          productCount = data.length
        } else if (data.totalCount !== undefined) {
          productCount = data.totalCount
        }
        
        console.log(`📊 Productos existentes: ${productCount}`)
        if (productCount > 0) {
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Error al verificar datos del usuario:', error)
      return false
    }
  }
}