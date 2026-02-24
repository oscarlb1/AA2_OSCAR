<script setup lang="ts">
</script>

<template>
  <v-app-bar color="primary" elevation="2">
    <v-app-bar-title>Panel de Administración</v-app-bar-title>
    <template #append>
      <v-btn variant="text" to="/admin/dashboard">Dashboard</v-btn>
      <v-btn variant="text" to="/admin/categorias">Categorías</v-btn>
      <v-btn variant="text" to="/admin/asignaturas">Asignaturas</v-btn>
    </template>
  </v-app-bar>
</template>
