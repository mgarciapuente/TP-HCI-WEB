// Archivo índice para tipos - facilita las importaciones
//reexportar todo lo que haya sido exportado en userTypes.ts.
//Así, en lugar de importar los tipos de este modo:
//import { User, UserRole } from '@/types/userTypes'
//Podemos hacerlo así:
//import { User, UserRole } from '@/types'
//mas escalable y limpio.

export * from './userTypes'
export * from './listTypes'
