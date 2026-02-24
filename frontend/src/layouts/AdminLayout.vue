<script setup lang="ts">
import AdminHeader from '@/components/AdminHeader.vue'
import AdminFooter from '@/components/AdminFooter.vue'
</script>

<template>
  <v-app>
    <AdminHeader />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <AdminFooter />
  </v-app>
</template>
