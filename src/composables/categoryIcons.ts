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

// Lista de iconos disponibles para categorías con sus nombres descriptivos
export const availableIcons: Array<{ icon: string; name: string }> = [
  // Alimentos básicos
  { icon: 'mdi-apple', name: 'Frutas' },
  { icon: 'mdi-carrot', name: 'Verduras' },
  { icon: 'mdi-cow', name: 'Lácteos' },
  { icon: 'mdi-food-steak', name: 'Carnes' },
  { icon: 'mdi-bread-slice', name: 'Panadería' },
  { icon: 'mdi-bottle-soda-classic', name: 'Bebidas' },
  { icon: 'mdi-shaker', name: 'Condimentos' },
  { icon: 'mdi-snowflake', name: 'Congelados' },
  
  // Más opciones de alimentos
  { icon: 'mdi-fish', name: 'Pescados' },
  { icon: 'mdi-grain', name: 'Cereales' },
  { icon: 'mdi-coffee', name: 'Café/Té' },
  { icon: 'mdi-candy', name: 'Dulces' },
  { icon: 'mdi-pizza', name: 'Comida rápida' },
  { icon: 'mdi-food-variant', name: 'Comida preparada' },
  { icon: 'mdi-egg', name: 'Huevos' },
  { icon: 'mdi-food-apple-outline', name: 'Snacks saludables' },
  
  // Cuidado personal e higiene
  { icon: 'mdi-toothbrush', name: 'Higiene bucal' },
  { icon: 'mdi-shower', name: 'Higiene personal' },
  { icon: 'mdi-face-woman', name: 'Cosmética' },
  { icon: 'mdi-medical-bag', name: 'Farmacia' },
  { icon: 'mdi-hair-dryer', name: 'Cuidado del cabello' },
  
  // Limpieza del hogar
  { icon: 'mdi-spray-bottle', name: 'Productos de limpieza' },
  { icon: 'mdi-broom', name: 'Artículos de limpieza' },
  { icon: 'mdi-washing-machine', name: 'Lavandería' },
  
  // Mascotas
  { icon: 'mdi-dog', name: 'Mascotas' },
  { icon: 'mdi-cat', name: 'Comida de gatos' },
  { icon: 'mdi-bone', name: 'Comida de perros' },
  
  // Bebés y niños
  { icon: 'mdi-baby-bottle', name: 'Bebés' },
  { icon: 'mdi-teddy-bear', name: 'Juguetes' },
  { icon: 'mdi-school', name: 'Escolar' },
  
  // Hogar y jardín
  { icon: 'mdi-flower', name: 'Jardín' },
  { icon: 'mdi-lightbulb', name: 'Electricidad' },
  { icon: 'mdi-tools', name: 'Herramientas' },
  { icon: 'mdi-sofa', name: 'Hogar' },
  
  // Otros
  { icon: 'mdi-gift', name: 'Regalos' },
  { icon: 'mdi-book', name: 'Libros/Revistas' },
  { icon: 'mdi-gamepad-variant', name: 'Entretenimiento' },
  { icon: 'mdi-car', name: 'Automotriz' },
  { icon: 'mdi-wrench', name: 'Reparaciones' },
  { icon: 'mdi-package-variant', name: 'General' },
]

// Función para obtener el icono de una categoría
export function useCategoryIcon() {
  const getCategoryIcon = (category: Category | string): string => {
    // Si es un objeto Category, primero verificar si tiene icono en metadata
    if (typeof category === 'object' && category.metadata?.icon) {
      return category.metadata.icon
    }
    
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

  // Función para obtener iconos disponibles excluyendo los ya usados
  const getAvailableIcons = (existingCategories: Category[] = []) => {
    const usedIcons = new Set(existingCategories.map(category => getCategoryIcon(category)))
    
    return availableIcons.filter(iconData => !usedIcons.has(iconData.icon))
  }

  // Función para obtener todos los iconos disponibles
  const getAllAvailableIcons = () => {
    return [...availableIcons]
  }

  return {
    getCategoryIcon,
    getAvailableIcons,
    getAllAvailableIcons
  }
}