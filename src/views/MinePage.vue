<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <salt-title-bar text="我的" :show-back-btn="false" />
    </ion-header>
    <ion-content :fullscreen="true">
      <salt-rounded-column>
        <salt-item text="个人资料" @click="router.push('/tabs/mine/personal-profile')">
          <template #icon><icon-id-card class="salt-icon" /></template>
        </salt-item>
        <salt-item text="账号绑定" @click="router.push('/tabs/mine/account-bind')">
          <template #icon><icon-account-bind class="salt-icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column title="数据集合">
        <salt-item text="离线地图" :enabled="false">
          <template #icon><icon-localtion class="salt-icon" /></template>
        </salt-item>
        <salt-item text="离线数据" :enabled="false">
          <template #icon><icon-database class="salt-icon" /></template>
        </salt-item>
        <salt-item text="订单集合" :enabled="false">
          <template #icon><icon-order class="salt-icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column>
        <salt-item text="通用设置" @click="router.push('/tabs/mine/settings')">
          <template #icon><icon-setting class="salt-icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column>
        <salt-item text="数据备份" :enabled="false">
          <template #icon><icon-cloud-sync class="salt-icon" /></template>
        </salt-item>
      </salt-rounded-column>
      <salt-rounded-column>
        <salt-item text="关于" @click="router.push('/tabs/mine/about')">
          <template #icon><icon-info-circle class="salt-icon" /></template>
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
import {
  IconIdCard,
  IconLocaltion,
  IconDatabase,
  IconInfoCircle,
  IconOrder,
  IconAccountBind,
  IconCloudSync,
  IconSetting
} from '@/icons'

// 优先使用 Ant Design 官方图标库（https://www.iconfont.cn/collections/detail?spm=a313x.collections_index.i1.d9df05512.572c3a81Gscmd3&cid=9402）

const router = useRouter()

onIonViewWillLeave(() => {
  window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped></style>