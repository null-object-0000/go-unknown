<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="go" href="/tabs/go">
          <ion-icon aria-hidden="true" :icon="compass" />
          <ion-label>出发</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="clock" href="/tabs/clock">
          <ion-icon aria-hidden="true" :icon="flag" />
          <ion-label>打卡</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="mine" href="/tabs/mine">
          <ion-icon aria-hidden="true" :icon="person" />
          <ion-label>我的</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script  setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { compass, flag, person } from 'ionicons/icons';
</script>

<style>
ion-tabs ion-tab-button {
  color: rgba(140, 140, 140, 0.5)
}

ion-tabs ion-tab-button.tab-selected {
  color: var(--salt-color-hightlight)
}

@media (prefers-color-scheme: dark) {
  ion-tabs ion-tab-button {
    color: rgba(225, 230, 235, 0.5)
  }
}

ion-tabs ion-icon {
  font-size: 24px;
}

ion-tabs ion-label {
  font-size: 10px;
}
</style>