<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'

const authStore = useAuthStore()
const uiStore = useUiStore()

// Esquema de validación con Yup
const schema = yup.object({
  email: yup.string().required('El email es obligatorio').email('Introduce un email válido'),
  password: yup.string().required('La contraseña es obligatoria'),
})

const { handleSubmit, isSubmitting } = useForm({ validationSchema: schema })

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values.email, values.password)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
    uiStore.showSnackbar(message, 'error')
  }
})
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6" min-width="380" max-width="440" elevation="8" rounded="lg">
      <v-card-title class="text-h5 font-weight-bold text-center mb-2">
        Iniciar Sesión
      </v-card-title>
      <v-card-subtitle class="text-center mb-4">
        Accede a tu panel de administración
      </v-card-subtitle>

      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            class="mb-2"
            :error-messages="emailError"
          />

          <v-text-field
            v-model="password"
            label="Contraseña"
            type="password"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :error-messages="passwordError"
          />

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            :loading="isSubmitting"
          >
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
