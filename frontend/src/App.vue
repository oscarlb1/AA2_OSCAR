<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import { useUiStore } from '@/stores/uiStore'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

const route = useRoute()
const uiStore = useUiStore()

const layouts: Record<string, typeof AuthLayout> = {
  AuthLayout,
  MainLayout,
  AdminLayout,
}

const layout = computed(() => {
  const layoutName = (route.meta?.layout as string) ?? 'MainLayout'
  return layouts[layoutName] ?? MainLayout
})

const theme = useTheme()
watchEffect(() => {
  theme.global.name.value = uiStore.isDarkTheme ? 'dark' : 'light'
})
</script>

<template>
  <component :is="layout">
    <router-view />
  </component>

  <v-snackbar
    v-model="uiStore.snackbar.visible"
    :color="uiStore.snackbar.color"
    :timeout="3000"
    location="bottom right"
  >
    {{ uiStore.snackbar.message }}
    <template #actions>
      <v-btn variant="text" @click="uiStore.snackbar.visible = false">Cerrar</v-btn>
    </template>
  </v-snackbar>
</template>
