<script setup lang="ts">
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('user-theme', theme.global.name.value)
}

onMounted(() => {
  const savedTheme = localStorage.getItem('user-theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }
})
</script>

<template>
  <v-app-bar color="primary" elevation="2">
    <v-app-bar-title>Panel de Administración</v-app-bar-title>
    
    <template #append>
      <v-btn icon @click="toggleTheme">
        <v-icon>
          {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>

      <v-btn variant="text" to="/admin/dashboard">Dashboard</v-btn>
      <v-btn variant="text" to="/admin/categorias">Categorías</v-btn>
      <v-btn variant="text" to="/admin/asignaturas">Asignaturas</v-btn>
    </template>
  </v-app-bar>
</template>