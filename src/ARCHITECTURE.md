# 📁 Arquitectura de Carpetas - Frontend

Este documento explica la organización y propósito de las principales carpetas de arquitectura en el proyecto.

## 🔧 `/services`

**Propósito**: Contiene la lógica de comunicación con APIs externas y servicios de terceros.

### Archivos incluidos:
- **`apiConfig.ts`**: Configuración centralizada de la API (URLs, headers, endpoints)
- **`userService.ts`**: Funciones para operaciones de usuario (login, registro, perfil, etc.)
- **`index.ts`**: Barrel export que reexporta todos los servicios

### Qué tipo de archivos van aquí:
- ✅ Funciones que hacen llamadas HTTP (fetch, axios)
- ✅ Configuraciones de API (URLs base, headers, interceptors)
- ✅ Servicios de terceros (pagos, analytics, etc.)
- ✅ Transformadores de datos de API
- ✅ Manejo de errores de red

### Ejemplo de uso:
```typescript
// services/userService.ts
export const userService = {
  async login(credentials: Credentials): Promise<AuthToken> {
    const response = await fetch('/api/login', { ... })
    return handleApiResponse(response)
  }
}
```

---

## 🗄️ `/stores`

**Propósito**: Manejo del estado global de la aplicación usando Pinia.

### Archivos incluidos:
- **`auth.ts`**: Estado de autenticación (usuario logueado, token, sesión)
- **`almacen.ts`**: Estado relacionado con la funcionalidad de almacén/pantry

### Qué tipo de archivos van aquí:
- ✅ Stores de Pinia con estado reactivo
- ✅ Actions para modificar el estado
- ✅ Getters para computar valores derivados
- ✅ Estado compartido entre múltiples componentes
- ✅ Persistencia de estado (localStorage, sessionStorage)

### Ejemplo de uso:
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  
  const login = (userData: User) => {
    user.value = userData
  }
  
  return { user, isLoggedIn, login }
})
```

---

## 📋 `/types`

**Propósito**: Definiciones de tipos TypeScript para toda la aplicación.

### Archivos incluidos:
- **`userTypes.ts`**: Interfaces y tipos relacionados con usuarios
- **`vuetify-styles.d.ts`**: Declaraciones de tipos para Vuetify
- **`index.ts`**: Barrel export que reexporta todos los tipos

### Qué tipo de archivos van aquí:
- ✅ Interfaces TypeScript
- ✅ Types y Union types
- ✅ Enums
- ✅ Declaraciones de módulos externos
- ✅ Tipos derivados de APIs
- ✅ Constantes tipadas

### Ejemplo de uso:
```typescript
// types/userTypes.ts
export interface User {
  id: number
  name: string
  email: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// types/index.ts
export * from './userTypes'
```

---

## 🔄 Patrón Barrel Exports

Todas las carpetas utilizan el patrón **barrel export** con archivos `index.ts`:

```typescript
// En lugar de:
import { userService } from '../services/userService'
import { API_CONFIG } from '../services/apiConfig'

// Puedes usar:
import { userService, API_CONFIG } from '../services'
```

### Beneficios:
- 🎯 **Imports más limpios** y legibles
- 🔧 **Facilita refactoring** interno sin cambiar imports
- 📦 **Encapsulación** de la estructura interna
- 🚀 **Escalabilidad** para agregar nuevos archivos

---

## 🏗️ Principios de Organización

### **Separación de Responsabilidades**
- **Services**: "¿Cómo obtengo/envío datos?"
- **Stores**: "¿Dónde guardo el estado?"
- **Types**: "¿Qué forma tienen mis datos?"

### **Flujo de Datos**
```
Components → Stores → Services → API
    ↑         ↑        ↑
  Types    Types    Types
```

### **Buenas Prácticas**
- Un archivo por funcionalidad específica
- Nombres descriptivos y consistentes
- Usar barrel exports para imports limpios
- Documentar interfaces complejas
- Mantener tipos cerca de su uso

---

## 📚 Recursos Adicionales

- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)