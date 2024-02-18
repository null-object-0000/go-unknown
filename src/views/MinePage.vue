<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <salt-title-bar :show-back-btn="false" />
    </ion-header>
    <ion-content :fullscreen="true">
      <salt-rounded-column>
        <salt-item text="账号绑定" @click="router.push('/tabs/mine/account-bind')">
          <template #icon><icon-account-bind class="icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column>
        <salt-item text="订单集合">
          <template #icon><icon-order class="icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column title="离线资源">
        <salt-item text="离线地图">
          <template #icon><icon-localtion class="icon" /></template>
        </salt-item>
        <salt-item text="离线数据">
          <template #icon><icon-database class="icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column>
        <salt-item text="Salt UI" @click="router.push('/tabs/mine/salt-demo')">
          <template #icon><icon-demo class="icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column>
        <salt-item text="关于" @click="router.push('/tabs/mine/about')">
          <template #icon><icon-info-circle class="icon" /></template>
        </salt-item>
      </salt-rounded-column>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonHeader, onIonViewWillLeave } from '@ionic/vue';
import {
  SaltItem,
  SaltRoundedColumn,
  SaltTitleBar
} from '@snewbie/salt-ui-vue'
import IconLocaltion from '@/icons/location.svg'
import IconDatabase from '@/icons/database.svg'
import IconInfoCircle from '@/icons/info-circle.svg'
import IconDemo from '@/icons/demo.svg'
import IconOrder from '@/icons/order.svg'
import IconAccountBind from '@/icons/account-bind.svg'

// 优先使用 Ant Design 官方图标库（https://www.iconfont.cn/collections/detail?spm=a313x.collections_index.i1.d9df05512.572c3a81Gscmd3&cid=9402）

const router = useRouter()

onIonViewWillLeave(() => {
  window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped>
.icon {
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