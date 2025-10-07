// CONFIGURACIÓN DE BYPASS TEMPORAL
// Cambiar a false cuando el backend esté disponible

export const DEV_CONFIG = {
  // Bypass para login/registro sin backend
  BYPASS_AUTH: true,
  
  // Bypass para otras funcionalidades (para uso futuro)
  BYPASS_API_CALLS: true,
  
  // Datos mock para testing
  MOCK_USER_DATA: {
    id: 1,
    name: 'Usuario',
    surname: 'Demo',
    email: 'demo@canasta.com',
    metadata: {},
    createdAt: '2024-01-15',
    updatedAt: new Date().toISOString().split('T')[0]
  },
  
  // Token mock
  MOCK_TOKEN: `mock-jwt-token-${Date.now()}`
}

// Helper para logs de bypass
export const logBypass = (action: string, data?: any) => {
  if (DEV_CONFIG.BYPASS_AUTH) {
    console.log(`🔄 BYPASS: ${action}`, data || '')
  }
}