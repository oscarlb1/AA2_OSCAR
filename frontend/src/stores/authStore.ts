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

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    const storedUser = localStorage.getItem('user')
    const isAuthenticated = ref<boolean>(!!storedUser)
    const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)

    async function login(email: string, password: string): Promise<void> {
        // Log que llega desde el back
        console.log("👉 1. Datos que llegan del formulario:", { 
            email_recibido: email, 
            password_recibida: password,
            longitud_password: password.length 
        })

        const response = await fetch('http://localhost:3000/usuarios')
        if (!response.ok) throw new Error('Error de conexión con el servidor')

        const usuarios: User[] = await response.json()
        
        // Log de usuarios
        console.log("👉 2. Usuarios en la base de datos:", usuarios)

        // Buscar usuario 
        const loggedUser = usuarios.find(u => u.email === email && u.password === password)

        // Resultados
        console.log("👉 3. Resultado de la comparación:", loggedUser)

        if (!loggedUser) {
            console.error("❌ FALLO: No coinciden. Revisa si hay espacios extra en el paso 1 o paso 2.")
            throw new Error('Credenciales incorrectas')
        }

        console.log("✅ ÉXITO: Usuario encontrado. Redirigiendo...")
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