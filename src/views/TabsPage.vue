<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" v-if="showTabBar">
        <ion-tab-button v-for="item of tabs" :tab="item.tab" :href="item.href">
          <ion-icon aria-hidden="true" :icon="item.icon" />
          <ion-label>{{ item.label }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script  setup lang="ts">
import { App } from '@capacitor/app';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, useBackButton, useIonRouter } from '@ionic/vue';
import { compass, flag, person } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const tabs = [
  {
    tab: 'go',
    href: '/tabs/go',
    icon: compass,
    label: '出发'
  },
  {
    tab: 'clock',
    href: '/tabs/clock',
    icon: flag,
    label: '打卡'
  },
  {
    tab: 'mine',
    href: '/tabs/mine',
    icon: person,
    label: '我的'
  }
]
const showTabBar = ref(true)
const router = useRouter();
const ionRouter = useIonRouter();

// 在 tabs 页面触发返回动作时，最小化 App
useBackButton(100, () => {
  const currentRoute = router.currentRoute.value.fullPath;
  if (tabs.some(item => item.href === currentRoute)) {
    App.minimizeApp();
  } else if (ionRouter.canGoBack()) {
    ionRouter.back();
  } else {
    App.minimizeApp();
  }
});

// 只有在 tabs 页面才显示 TabBar
router.afterEach((to) => {
  showTabBar.value = tabs.some(item => item.href === to.path)
})

</script>

<style scoped>
ion-tabs ion-tab-button {
  color: rgba(var(--salt-color-sub-text-rgb), 0.5)
}

ion-tabs ion-tab-button.tab-selected {
  color: var(--salt-color-highlight)
}

ion-tabs ion-icon {
  font-size: 24px;
}

ion-tabs ion-label {
  font-size: 10px;
}
</style>