// Composable para manejar avatares predefinidos

export interface AvatarOption {
  id: number
  icon: string
  color: string
  backgroundColor: string
  name: string
}

// Lista de avatares predefinidos usando iconos de Material Design
export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 1,
    icon: 'mdi-account-circle',
    color: '#FFFFFF',
    backgroundColor: '#465D46',
    name: 'Clásico Verde'
  },
  {
    id: 2,
    icon: 'mdi-face-man',
    color: '#FFFFFF',
    backgroundColor: '#F5844E',
    name: 'Persona Naranja'
  },
  {
    id: 3,
    icon: 'mdi-emoticon-happy',
    color: '#FFFFFF',
    backgroundColor: '#4A90E2',
    name: 'Feliz Azul'
  },
  {
    id: 4,
    icon: 'mdi-cat',
    color: '#FFFFFF',
    backgroundColor: '#8E44AD',
    name: 'Gato Morado'
  },
  {
    id: 5,
    icon: 'mdi-leaf',
    color: '#FFFFFF',
    backgroundColor: '#27AE60',
    name: 'Hoja Verde'
  },
  {
    id: 6,
    icon: 'mdi-food-apple',
    color: '#FFFFFF',
    backgroundColor: '#E74C3C',
    name: 'Manzana Roja'
  }
]

// Función para obtener un avatar por ID
export const getAvatarById = (avatarId: number): AvatarOption => {
  const avatar = AVATAR_OPTIONS.find(option => option.id === avatarId)
  return avatar || AVATAR_OPTIONS[0] // Fallback al primero si no encuentra
}

// Avatar por defecto para nuevos usuarios
export const DEFAULT_AVATAR_ID = 1

// Composable para usar avatares
export const useAvatars = () => {
  return {
    avatarOptions: AVATAR_OPTIONS,
    getAvatarById,
    defaultAvatarId: DEFAULT_AVATAR_ID
  }
}