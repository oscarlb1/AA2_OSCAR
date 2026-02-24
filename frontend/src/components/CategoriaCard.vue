<script setup lang="ts">
import type { Categoria } from '@/stores/categoriasStore'

const props = defineProps<{
  categoria: Categoria
}>()

const emit = defineEmits<{
  editar: [categoria: Categoria]
  borrar: [id: number]
}>()
</script>

<template>
  <v-card rounded="lg" elevation="2" height="100%">
    <v-card-title class="text-subtitle-1 font-weight-bold pt-4 px-4">
      {{ props.categoria.nombre }}
    </v-card-title>

    <v-card-text class="text-body-2 text-medium-emphasis px-4 pb-2">
      {{ props.categoria.descripcion || 'Sin descripción' }}
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-spacer />
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-pencil"
        size="small"
        @click="emit('editar', props.categoria)"
      >
        Editar
      </v-btn>
      <v-btn
        variant="tonal"
        color="error"
        prepend-icon="mdi-delete"
        size="small"
        @click="emit('borrar', props.categoria.id)"
      >
        Borrar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
