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

    return {
        snackbar,
        showSnackbar,
    }
})
