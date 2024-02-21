<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar text="订单集合" @back="onBack" />
        </ion-header>
        <ion-content :fullscreen="true">
            <salt-rounded-column v-for="i of 3">
                <order-item category="同程旅行" title="斯维登度假酒店(长兴轻纺城)" first-desc="04-28入住 至 04-29离店" second-desc="精品大床房"
                    :total-amount="48.45" show-order-status-desc="已经离店">
                </order-item>
            </salt-rounded-column>
            <salt-rounded-column v-for="i of 20">
                <order-item category="江苏ETC" title="浙江鳌江站 - 浙江灵昆站" first-desc="出站时间：2022-12-31 13:42:32" second-desc=""
                    :total-amount="48.45" show-order-status-desc="已经离店" />
            </salt-rounded-column>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn } from '@snewbie/salt-ui-vue'
import OrderItem from '@/components/OrderItem.vue'

const router = useIonRouter()

const onBack = () => {
    if (router.canGoBack()) {
        router.back()
    } else {
        router.push('/tabs/mine')
    }
};

onIonViewWillLeave(() => {
    window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped></style>