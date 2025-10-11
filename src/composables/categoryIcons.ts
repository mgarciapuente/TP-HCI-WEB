import type { Category } from '../services/productsService'

// Mapeo de nombres de categorías a iconos de Material Design Icons
const categoryIconMap: Record<string, string> = {
  // Alimentos
  'Lácteos': 'mdi-cow',
  'Carnes': 'mdi-food-steak',
  'Verduras': 'mdi-carrot',
  'Frutas': 'mdi-apple',
  'Panadería': 'mdi-bread-slice',
  'Bebidas': 'mdi-bottle-soda-classic',
  'Condimentos': 'mdi-shaker',
  'Congelados': 'mdi-snowflake',
}

// Función para obtener el icono de una categoría
export function useCategoryIcon() {
  const getCategoryIcon = (category: Category | string): string => {
    const categoryName = typeof category === 'string' ? category : category.name
    
    // Primero buscar por nombre exacto (case insensitive)
    const exactMatch = categoryIconMap[categoryName.toLowerCase()]
    if (exactMatch) return exactMatch
    
    // Buscar por coincidencia parcial
    const partialMatch = Object.keys(categoryIconMap).find(key => 
      categoryName.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(categoryName.toLowerCase())
    )
    
    if (partialMatch) return categoryIconMap[partialMatch]
    
    // Si no se encuentra, usar icono por defecto
    return 'mdi-package-variant'
  }

  return {
    getCategoryIcon
  }
}