import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Asignatura {
    id: number
    nombre: string
    descripcion: string
    categoriaId: number
    duracionHoras: number
}

const API_URL = 'http://localhost:3000/asignaturas'

export const useAsignaturasStore = defineStore('asignaturas', () => {
    const asignaturas = ref<Asignatura[]>([])
    const loading = ref<boolean>(false)

    async function fetchAsignaturas(): Promise<void> {
        loading.value = true
        try {
            const response = await fetch(API_URL)
            if (!response.ok) throw new Error('Error al obtener las asignaturas')
            asignaturas.value = await response.json()
        } finally {
            loading.value = false
        }
    }

    async function crearAsignatura(datos: Omit<Asignatura, 'id'>): Promise<void> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        })
        if (!response.ok) throw new Error('Error al crear la asignatura')
        const nueva: Asignatura = await response.json()
        asignaturas.value.push(nueva)
    }

    async function actualizarAsignatura(id: number, datos: Omit<Asignatura, 'id'>): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...datos }),
        })
        if (!response.ok) throw new Error('Error al actualizar la asignatura')
        const actualizada: Asignatura = await response.json()
        const index = asignaturas.value.findIndex((a) => a.id === id)
        if (index !== -1) asignaturas.value[index] = actualizada
    }

    async function borrarAsignatura(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Error al borrar la asignatura')
        asignaturas.value = asignaturas.value.filter((a) => a.id !== id)
    }

    return {
        asignaturas,
        loading,
        fetchAsignaturas,
        crearAsignatura,
        actualizarAsignatura,
        borrarAsignatura,
    }
})
