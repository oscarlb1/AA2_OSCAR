<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAsignaturasStore, type Asignatura } from '@/stores/asignaturasStore'
import { useCategoriasStore } from '@/stores/categoriasStore'
import { useUiStore } from '@/stores/uiStore'
import AsignaturaCard from '@/components/AsignaturaCard.vue'

const asignaturasStore = useAsignaturasStore()
const categoriasStore = useCategoriasStore()
const uiStore = useUiStore()

// ── Estado de carga local (espera ambas peticiones) ─────────────────────────
const isLoading = ref(true)

// ── Diálogo ───────────────────────────────────────────────────────────────────
const dialogVisible = ref(false)
const modoEdicion = ref(false)
const asignaturaEditandoId = ref<string | number | null>(null)

// ── Validación con vee-validate + yup ─────────────────────────────────────────
const schema = yup.object({
  nombre: yup.string().required('El nombre es obligatorio'),
  descripcion: yup.string().default(''),
  categoriaId: yup.number().required('La categoría es obligatoria').min(1, 'Selecciona una categoría'),
  duracionHoras: yup
    .number()
    .required('La duración es obligatoria')
    .min(1, 'Debe ser al menos 1 hora')
    .integer('Debe ser un número entero'),
})

const { handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema: schema })
const { value: nombre, errorMessage: nombreError } = useField<string>('nombre')
const { value: descripcion } = useField<string>('descripcion')
const { value: categoriaId, errorMessage: categoriaError } = useField<number>('categoriaId')
const { value: duracionHoras, errorMessage: duracionError } = useField<number>('duracionHoras')

// ── Abrir diálogo ──────────────────────────────────────────────────────────────
function abrirCrear() {
  modoEdicion.value = false
  asignaturaEditandoId.value = null
  resetForm({ values: { nombre: '', descripcion: '', categoriaId: 0, duracionHoras: 0 } })
  dialogVisible.value = true
}

function abrirEditar(asignatura: Asignatura) {
  modoEdicion.value = true
  asignaturaEditandoId.value = asignatura.id
  resetForm({
    values: {
      nombre: asignatura.nombre,
      descripcion: asignatura.descripcion,
      categoriaId: asignatura.categoriaId,
      duracionHoras: asignatura.duracionHoras,
    },
  })
  dialogVisible.value = true
}

// ── Submit ─────────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (values) => {
  try {
    const datos = {
      nombre: values.nombre,
      descripcion: values.descripcion ?? '',
      categoriaId: Number(values.categoriaId),
      duracionHoras: Number(values.duracionHoras),
    }
    if (modoEdicion.value && asignaturaEditandoId.value !== null) {
      await asignaturasStore.actualizarAsignatura(asignaturaEditandoId.value, datos)
      uiStore.showSnackbar('Asignatura actualizada correctamente', 'success')
    } else {
      await asignaturasStore.crearAsignatura(datos)
      uiStore.showSnackbar('Asignatura creada correctamente', 'success')
    }
    dialogVisible.value = false
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado'
    uiStore.showSnackbar(message, 'error')
  }
})

// ── Borrar ─────────────────────────────────────────────────────────────────────
async function borrarAsignatura(id: number) {
  try {
    await asignaturasStore.borrarAsignatura(id)
    uiStore.showSnackbar('Asignatura eliminada', 'success')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al eliminar'
    uiStore.showSnackbar(message, 'error')
  }
}

// ── Resolución de nombre de categoría ─────────────────────────────────────────
function getCategoriaNombre(categoriaId: number): string {
  // json-server v1 devuelve los IDs como strings; normalizamos con Number() para comparar
  return (
    categoriasStore.categorias.find((c) => Number(c.id) === Number(categoriaId))?.nombre ??
    'Sin categoría'
  )
}

// ── Montaje ────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([asignaturasStore.fetchAsignaturas(), categoriasStore.fetchCategorias()])
  isLoading.value = false
})
</script>

<template>
  <v-container>
    <!-- Cabecera -->
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">Asignaturas</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirCrear">
        Nueva Asignatura
      </v-btn>
    </div>

    <!-- Cargando -->
    <div v-if="isLoading" class="d-flex justify-center py-12">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Sin datos -->
    <v-alert
      v-else-if="asignaturasStore.asignaturas.length === 0"
      type="info"
      variant="tonal"
      text="No hay asignaturas todavía. ¡Crea la primera!"
    />

    <!-- Grid de tarjetas -->
    <v-row v-else>
      <v-col
        v-for="asignatura in asignaturasStore.asignaturas"
        :key="asignatura.id"
        cols="12"
        sm="6"
        md="4"
      >
        <AsignaturaCard
          :asignatura="asignatura"
          :categoria-nombre="getCategoriaNombre(asignatura.categoriaId)"
          @editar="abrirEditar"
          @borrar="borrarAsignatura"
        />
      </v-col>
    </v-row>

    <!-- Diálogo Crear / Editar -->
    <v-dialog v-model="dialogVisible" max-width="500" persistent>
      <v-card rounded="lg">
        <v-card-title class="text-subtitle-1 font-weight-bold pa-5">
          {{ modoEdicion ? 'Editar asignatura' : 'Nueva asignatura' }}
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
              rows="2"
              auto-grow
              class="mb-3"
            />

            <v-select
              v-model="categoriaId"
              :items="categoriasStore.categorias"
              item-title="nombre"
              item-value="id"
              label="Categoría *"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              :error-messages="categoriaError"
            />

            <v-text-field
              v-model="duracionHoras"
              label="Duración (horas) *"
              type="number"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-clock-outline"
              :error-messages="duracionError"
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
