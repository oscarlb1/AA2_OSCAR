import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface User {
    id: number
    nombre: string
    email: string
    rol: string
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    const isAuthenticated = ref<boolean>(false)
    const user = ref<User | null>(null)

    async function login(email: string, password: string): Promise<void> {
        const response = await fetch(
            `http://localhost:3000/usuarios?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        )

        if (!response.ok) {
            throw new Error('Error de conexión con el servidor')
        }

        const results: User[] = await response.json()

        if (results.length === 0) {
            throw new Error('Credenciales incorrectas')
        }

        const loggedUser = results[0]!
        isAuthenticated.value = true
        user.value = loggedUser

        await router.push('/admin/dashboard')
    }

    function logout(): void {
        isAuthenticated.value = false
        user.value = null
        router.push('/login')
    }

    return {
        isAuthenticated,
        user,
        login,
        logout,
    }
})
