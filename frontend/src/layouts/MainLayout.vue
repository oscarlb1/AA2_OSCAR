<script setup lang="ts">
import PublicHeader from '@/components/PublicHeader.vue'
import PublicFooter from '@/components/PublicFooter.vue'
</script>

<template>
  <v-app>
    <PublicHeader />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <PublicFooter />
  </v-app>
</template>
