import { defineStore } from 'pinia'
import { ref } from 'vue'

type SnackbarColor = 'success' | 'error' | 'warning' | 'info'

interface SnackbarState {
    visible: boolean
    message: string
    color: SnackbarColor
}

export const useUiStore = defineStore('ui', () => {
    const snackbar = ref<SnackbarState>({
        visible: false,
        message: '',
        color: 'success',
    })

    function showSnackbar(message: string, color: SnackbarColor = 'success') {
        snackbar.value = {
            visible: true,
            message,
            color,
        }
    }

    const isDarkTheme = ref<boolean>(localStorage.getItem('theme') === 'dark')

    function toggleTheme() {
        isDarkTheme.value = !isDarkTheme.value
        localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
    }

    return {
        snackbar,
        showSnackbar,
        isDarkTheme,
        toggleTheme,
    }
})
