<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <salt-rounded-column>
        <salt-item text="离线地图" icon-painter="qr-code"></salt-item>
        <salt-item text="离线数据" icon-painter="qr-code"></salt-item>
        <salt-item text="Salt UI 演示" icon-painter="qr-code" @click="router.push('/tabs/mine/salt-demo')">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 512 512"
              fill="currentColor">
              <path d="M256 144.03l-55.49-96.11h-79.43L256 281.61 390.92 47.92h-79.43L256 144.03z"></path>
              <path d="M409.4 47.92L256 313.61 102.6 47.92H15.74L256 464.08 496.26 47.92H409.4z"></path>
            </svg>
          </template>
        </salt-item>
      </salt-rounded-column>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import {
  SaltItem,
  SaltRoundedColumn,
} from '@snewbie/salt-ui-vue'

const router = useRouter()

</script>

<style scoped>
.icon {
  font-size: 24px;
  color: var(--salt-color-highlight);
  align-self: center;
}
</style>