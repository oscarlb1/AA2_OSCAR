<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
const uiStore = useUiStore()
</script>

<template>
  <v-app-bar elevation="2">
    <v-app-bar-title>AA2 Oscar</v-app-bar-title>
    <template #append>
      <v-btn variant="text" @click="uiStore.toggleTheme()">
        {{ uiStore.isDarkTheme ? 'Tema Claro' : 'Tema Oscuro' }}
      </v-btn>
      <v-btn variant="text" to="/">Inicio</v-btn>
      <v-btn variant="text" to="/login">Login</v-btn>
    </template>
  </v-app-bar>
</template>
