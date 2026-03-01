import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface User {
    id: number | string
    nombre: string
    email: string
    rol: string
    password?: string
}

/**
 * Gestiona el estado de la sesión del usuario.
 * Controla quién está logueado, su rol (admin/editor) y protege las rutas.
 */
export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    const storedUser = localStorage.getItem('user')
    const isAuthenticated = ref<boolean>(!!storedUser)
    const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)

    async function login(email: string, password: string): Promise<void> {
        const response = await fetch('http://localhost:3000/usuarios')
        if (!response.ok) throw new Error('Error de conexión con el servidor')

        const usuarios: User[] = await response.json()

        // Comprueba si existe un usuario con esas credenciales
        const loggedUser = usuarios.find(u => u.email === email && u.password === password)

        if (!loggedUser) {
            throw new Error('Credenciales incorrectas')
        }

        // Guarda la sesión
        isAuthenticated.value = true
        user.value = loggedUser
        localStorage.setItem('user', JSON.stringify(loggedUser))

        await router.push('/admin/dashboard')
    }

    function logout(): void {
        isAuthenticated.value = false
        user.value = null
        localStorage.removeItem('user')
        router.push('/login')
    }

    return {
        isAuthenticated,
        user,
        login,
        logout,
    }
})