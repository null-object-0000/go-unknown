<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onBeforeMount } from 'vue';
import { useStatusBar } from '@/hooks'

onBeforeMount(async () => {
  const statusBar = useStatusBar()
  statusBar.autoDarkTheme()
});
</script>

<style>
ion-content {
  --background: var(--salt-color-background)
}
</style>
