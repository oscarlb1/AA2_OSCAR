import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Categoria {
    id: string | number
    nombre: string
    descripcion: string
}

const API_URL = 'http://localhost:3000/categorias'

export const useCategoriasStore = defineStore('categorias', () => {
    const categorias = ref<Categoria[]>([])
    const loading = ref<boolean>(false)

    async function fetchCategorias(): Promise<void> {
        loading.value = true
        try {
            const response = await fetch(API_URL)
            if (!response.ok) throw new Error('Error al obtener las categorías')
            categorias.value = await response.json()
        } finally {
            loading.value = false
        }
    }

    async function crearCategoria(datos: Omit<Categoria, 'id'>): Promise<void> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        })
        if (!response.ok) throw new Error('Error al crear la categoría')
        const nueva: Categoria = await response.json()
        categorias.value.push(nueva)
    }

    async function actualizarCategoria(id: number, datos: Omit<Categoria, 'id'>): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...datos }),
        })
        if (!response.ok) throw new Error('Error al actualizar la categoría')
        const actualizada: Categoria = await response.json()
        const index = categorias.value.findIndex((c) => Number(c.id) === Number(id))
        if (index !== -1) categorias.value[index] = actualizada
    }

    async function borrarCategoria(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al borrar la categoría')
        categorias.value = categorias.value.filter((c) => Number(c.id) !== Number(id))
    }

    return {
        categorias,
        loading,
        fetchCategorias,
        crearCategoria,
        actualizarCategoria,
        borrarCategoria,
    }
})
