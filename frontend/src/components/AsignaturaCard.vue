<script setup lang="ts">
import type { Asignatura } from '@/stores/asignaturasStore'
import type { Categoria } from '@/stores/categoriasStore'

const props = defineProps<{
  asignatura: Asignatura
  categorias: Categoria[]
}>()

const emit = defineEmits<{
  editar: [asignatura: Asignatura]
  borrar: [id: number]
}>()

// Resuelve el nombre de la categoría a partir del categoriaId
function nombreCategoria(categoriaId: number): string {
  return props.categorias.find((c) => c.id === categoriaId)?.nombre ?? 'Sin categoría'
}
</script>

<template>
  <v-card rounded="lg" elevation="2" height="100%">
    <v-card-title class="text-subtitle-1 font-weight-bold pt-4 px-4">
      {{ props.asignatura.nombre }}
    </v-card-title>

    <v-card-text class="px-4 pb-2">
      <p class="text-body-2 text-medium-emphasis mb-3">
        {{ props.asignatura.descripcion || 'Sin descripción' }}
      </p>
      <div class="d-flex gap-2 flex-wrap">
        <v-chip size="small" color="primary" variant="tonal" prepend-icon="mdi-tag-outline">
          {{ nombreCategoria(props.asignatura.categoriaId) }}
        </v-chip>
        <v-chip size="small" color="secondary" variant="tonal" prepend-icon="mdi-clock-outline">
          {{ props.asignatura.duracionHoras }}h
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-spacer />
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-pencil"
        size="small"
        @click="emit('editar', props.asignatura)"
      >
        Editar
      </v-btn>
      <v-btn
        variant="tonal"
        color="error"
        prepend-icon="mdi-delete"
        size="small"
        @click="emit('borrar', props.asignatura.id)"
      >
        Borrar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
