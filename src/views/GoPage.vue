<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <salt-title-bar text="出发" :show-back-btn="false" />
    </ion-header>
    <ion-content :fullscreen="true">
      <ExploreContainer name="出发页面" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import {
  SaltTitleBar
} from '@snewbie/salt-ui-vue'
import ExploreContainer from '@/components/ExploreContainer.vue';
</script>
