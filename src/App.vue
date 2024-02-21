<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onBeforeMount } from 'vue';
import { useStatusBar } from '@/composables'

onBeforeMount(async () => {
  const statusBar = useStatusBar()
  statusBar.autoDarkTheme()
});
</script>

<style>
ion-content {
  --background: var(--salt-color-background)
}

.salt-icon {
  --icon-size: 24px;
  --icon-color: var(--salt-color-text);

  font-size: var(--icon-size);
  color: var(--icon-color);
  fill: var(--icon-color);
  align-self: center;
  width: var(--icon-size);
  height: var(--icon-size);
}
</style>
@/composables