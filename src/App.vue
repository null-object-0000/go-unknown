<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onBeforeMount } from 'vue';
import { StatusBar, Style } from '@capacitor/status-bar';

// 注意这里的色值没有走 css 变量，所以需要手动设置
const backgroundColor = {
  light: '#f7f9fa',
  dark: '#0C0C0C'
}

// Use matchMedia to check the user preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const toggleDarkTheme = async (dark: boolean | undefined) => {
  await StatusBar.setBackgroundColor({ color: dark ? backgroundColor.dark : backgroundColor.light });
  await StatusBar.setStyle({ style: Style.Light });
};

// Listen for changes to the prefers-color-scheme media query
prefersDark.addEventListener('change', (mediaQuery) => toggleDarkTheme(mediaQuery.matches));

onBeforeMount(async () => {
  toggleDarkTheme(prefersDark.matches);
});
</script>

<style>
ion-content {
  --background: var(--salt-color-background)
}
</style>
