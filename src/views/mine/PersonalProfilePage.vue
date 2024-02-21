<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar text="个人资料" @back="onBack" />
        </ion-header>
        <ion-content :fullscreen="true">
            <salt-rounded-column title="汽车牌照">
                <salt-item-edit v-model="carPlate" />
            </salt-rounded-column>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonContent, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn, SaltItemEdit } from '@snewbie/salt-ui-vue'
import { usePreferences } from '@/composables'
import { onBeforeMount, ref } from 'vue';

const router = useIonRouter()
const preferences = usePreferences()

const carPlate = ref<string | null>(null);

onBeforeMount(async () => {
    await preferences.watch('Mine.PersonalProfile.CarPlate', carPlate)
})

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