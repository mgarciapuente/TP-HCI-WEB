import { defineStore } from 'pinia';

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string; // kg, gr, lt, ml, unidades, etc.
  descripcion?: string;
  categoria?: string; // lácteos, carnes, verduras, etc.
  fechaVencimiento?: string;
  precio?: number;
  marca?: string;
}

interface Categoria {
  id: number;
  nombre: string;
  productos: Producto[];
}

export const useAlmacenStore = defineStore('almacen', {
  state: () => ({
    categorias: [] as Categoria[],
    cargando: false,
    error: null as string | null,
  }),
  actions: {
    // Gestión de categorías
    agregarCategoria(nombre: string) {
      const nuevaCategoria: Categoria = {
        id: Date.now(),
        nombre,
        productos: []
      };
      this.categorias.push(nuevaCategoria);
      return nuevaCategoria.id;
    },
    eliminarCategoria(categoriaId: number) {
      this.categorias = this.categorias.filter(c => c.id !== categoriaId);
    },
    editarNombreCategoria(categoriaId: number, nuevoNombre: string) {
      const categoria = this.categorias.find(c => c.id === categoriaId);
      if (categoria) categoria.nombre = nuevoNombre;
    },
    
    // Gestión de productos dentro de categorías
    agregarProducto(categoriaId: number, producto: Omit<Producto, 'id'>) {
      const categoria = this.categorias.find(c => c.id === categoriaId);
      if (categoria) {
        const nuevoProducto: Producto = {
          id: Date.now(),
          ...producto
        };
        categoria.productos.push(nuevoProducto);
      }
    },
    eliminarProducto(categoriaId: number, productoId: number) {
      const categoria = this.categorias.find(c => c.id === categoriaId);
      if (categoria) {
        categoria.productos = categoria.productos.filter(p => p.id !== productoId);
      }
    },
    editarProducto(categoriaId: number, productoEditado: Producto) {
      const categoria = this.categorias.find(c => c.id === categoriaId);
      if (categoria) {
        const index = categoria.productos.findIndex(p => p.id === productoEditado.id);
        if (index !== -1) {
          categoria.productos[index] = productoEditado;
        }
      }
    },
    actualizarCantidad(categoriaId: number, productoId: number, cantidad: number) {
      const categoria = this.categorias.find(c => c.id === categoriaId);
      if (categoria) {
        const producto = categoria.productos.find(p => p.id === productoId);
        if (producto) producto.cantidad = cantidad;
      }
    },
    
    // Estados generales
    setCargando(valor: boolean) {
      this.cargando = valor;
    },
    setError(mensaje: string | null) {
      this.error = mensaje;
    },
  },
  getters: {
    totalProductos: (state) => {
      return state.categorias.reduce((total, categoria) => {
        return total + categoria.productos.length;
      }, 0);
    },
    obtenerCategoria: (state) => (id: number) => {
      return state.categorias.find(c => c.id === id);
    }
  }
});
