import type { ShoppingList } from '../types/listTypes'

// Lista de iconos disponibles para listas de compras con sus nombres descriptivos
export const availableListIcons: Array<{ icon: string; name: string }> = [
  // Tipos de compras
  { icon: 'mdi-cart', name: 'Compras generales' },
  { icon: 'mdi-food', name: 'Comestibles' },
  { icon: 'mdi-fruit-grapes', name: 'Frutas y verduras' },
  { icon: 'mdi-food-steak', name: 'Carnicería' },
  { icon: 'mdi-bottle-wine', name: 'Bebidas' },
  
  // Ocasiones especiales
  { icon: 'mdi-party-popper', name: 'Fiesta' },
  { icon: 'mdi-cake', name: 'Cumpleaños' },
  { icon: 'mdi-pine-tree', name: 'Navidad' },
  { icon: 'mdi-heart', name: 'San Valentín' },
  { icon: 'mdi-grill', name: 'Barbacoa' },
  
  // Frecuencia/tipo de lista
  { icon: 'mdi-calendar-week', name: 'Compras semanales' },
  { icon: 'mdi-calendar-month', name: 'Compras mensuales' },
  { icon: 'mdi-lightning-bolt', name: 'Compras urgentes' },
  { icon: 'mdi-star', name: 'Lista especial' },
  
  // Categorías específicas
  { icon: 'mdi-baby-bottle', name: 'Productos para bebé' },
  { icon: 'mdi-dog', name: 'Mascotas' },
  { icon: 'mdi-medical-bag', name: 'Farmacia' },
  { icon: 'mdi-spray-bottle', name: 'Limpieza' },
  { icon: 'mdi-tools', name: 'Ferretería' },
  { icon: 'mdi-flower', name: 'Jardín' },
]

// Función para obtener el icono de una lista
export function useListIcon() {
  const getListIcon = (list: ShoppingList | string | any): string => {
    // Si es un objeto con metadata, verificar si tiene icono
    if (typeof list === 'object' && list.metadata?.icon) {
      return list.metadata.icon
    }
    
    // Si no se encuentra, usar icono por defecto
    return 'mdi-cart'
  }

  // Función para obtener todos los iconos disponibles para listas
  const getAllAvailableListIcons = () => {
    return [...availableListIcons]
  }

  // Función para obtener iconos sugeridos basados en el nombre de la lista
  const getSuggestedIcons = (listName: string): Array<{ icon: string; name: string }> => {
    const name = listName.toLowerCase()
    const suggestions: Array<{ icon: string; name: string } | undefined> = []
    
    // Lógica de sugerencias basada en palabras clave
    if (name.includes('semanal') || name.includes('semana')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-calendar-week'))
    }
    if (name.includes('mensual') || name.includes('mes')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-calendar-month'))
    }
    if (name.includes('urgente') || name.includes('rápid')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-lightning-bolt'))
    }
    if (name.includes('fiesta') || name.includes('celebr')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-party-popper'))
    }
    if (name.includes('cumple') || name.includes('birthday')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-cake'))
    }
    if (name.includes('navidad') || name.includes('christmas')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-pine-tree'))
    }
    if (name.includes('bebé') || name.includes('baby')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-baby-bottle'))
    }
    if (name.includes('mascota') || name.includes('perro') || name.includes('gato')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-dog'))
    }
    if (name.includes('farmacia') || name.includes('medicina')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-medical-bag'))
    }
    if (name.includes('limpieza') || name.includes('limpiar')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-spray-bottle'))
    }
    if (name.includes('barbacoa') || name.includes('asado') || name.includes('parrilla')) {
      suggestions.push(availableListIcons.find(icon => icon.icon === 'mdi-grill'))
    }
    
    // Filtrar elementos undefined y limitar a 3 sugerencias
    return suggestions.filter((suggestion): suggestion is { icon: string; name: string } => suggestion !== undefined).slice(0, 3)
  }

  return {
    getListIcon,
    getAllAvailableListIcons,
    getSuggestedIcons
  }
}