<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useCategoriasStore, type Categoria } from '@/stores/categoriasStore'
import { useUiStore } from '@/stores/uiStore'
import CategoriaCard from '@/components/CategoriaCard.vue'

const categoriasStore = useCategoriasStore()
const uiStore = useUiStore()

// ── Diálogo ──────────────────────────────────────────────────────────────────
const dialogVisible = ref(false)
const modoEdicion = ref(false)
const categoriaEditandoId = ref<number | null>(null)

// ── Validación con vee-validate + yup ────────────────────────────────────────
const schema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string().default(''),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema: schema })
const { value: nombre, errorMessage: nombreError } = useField<string>('nombre')
const { value: descripcion } = useField<string>('descripcion')

// ── Abrir diálogo ─────────────────────────────────────────────────────────────
function abrirCrear() {
  modoEdicion.value = false
  categoriaEditandoId.value = null
  resetForm({ values: { nombre: '', descripcion: '' } })
  dialogVisible.value = true
}

function abrirEditar(categoria: Categoria) {
  modoEdicion.value = true
  categoriaEditandoId.value = categoria.id
  resetForm({ values: { nombre: categoria.nombre, descripcion: categoria.descripcion } })
  dialogVisible.value = true
}

// ── Submit ────────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (values) => {
  try {
    const datos = { nombre: values.nombre, descripcion: values.descripcion ?? '' }
    if (modoEdicion.value && categoriaEditandoId.value !== null) {
      await categoriasStore.actualizarCategoria(categoriaEditandoId.value, datos)
      uiStore.showSnackbar('Categoría actualizada correctamente', 'success')
    } else {
      await categoriasStore.crearCategoria(datos)
      uiStore.showSnackbar('Categoría creada correctamente', 'success')
    }
    dialogVisible.value = false
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado'
    uiStore.showSnackbar(message, 'error')
  }
})

// ── Borrar ────────────────────────────────────────────────────────────────────
async function borrarCategoria(id: number) {
  try {
    await categoriasStore.borrarCategoria(id)
    uiStore.showSnackbar('Categoría eliminada', 'success')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al eliminar'
    uiStore.showSnackbar(message, 'error')
  }
}

// ── Montaje ───────────────────────────────────────────────────────────────────
onMounted(() => {
  categoriasStore.fetchCategorias()
})
</script>

<template>
  <v-container>
    <!-- Cabecera -->
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">Categorías</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirCrear">
        Nueva Categoría
      </v-btn>
    </div>

    <!-- Cargando -->
    <div v-if="categoriasStore.loading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Sin datos -->
    <v-alert
      v-else-if="categoriasStore.categorias.length === 0"
      type="info"
      variant="tonal"
      text="No hay categorías todavía. ¡Crea la primera!"
    />

    <!-- Grid de tarjetas -->
    <v-row v-else>
      <v-col
        v-for="categoria in categoriasStore.categorias"
        :key="categoria.id"
        cols="12"
        sm="6"
        md="4"
      >
        <CategoriaCard
          :categoria="categoria"
          @editar="abrirEditar"
          @borrar="borrarCategoria"
        />
      </v-col>
    </v-row>

    <!-- Diálogo Crear / Editar -->
    <v-dialog v-model="dialogVisible" max-width="480" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-subtitle-1 font-weight-bold pa-5">
          {{ modoEdicion ? 'Editar categoría' : 'Nueva categoría' }}
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <v-form @submit.prevent="onSubmit">
            <v-text-field
              v-model="nombre"
              label="Nombre *"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :error-messages="nombreError"
            />
            <v-textarea
              v-model="descripcion"
              label="Descripción"
              variant="outlined"
              density="comfortable"
              rows="3"
              auto-grow
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="dialogVisible = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="isSubmitting"
            @click="onSubmit"
          >
            {{ modoEdicion ? 'Guardar cambios' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
