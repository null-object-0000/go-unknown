<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar text="通用设置" @back="onBack" />
        </ion-header>
        <ion-content :fullscreen="true">
            <salt-rounded-column>
                <salt-item text="清除缓存" :enabled="false">
                    <template #icon><icon-clear class="salt-icon" /></template>
                </salt-item>
            </salt-rounded-column>
            <salt-rounded-column title="高德地图 Web 服务 Key">
                <salt-item-edit v-model="model.amapWebApiKey" @change="onAmapWebApikeyEditChange" />
            </salt-rounded-column>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonContent, onIonViewWillLeave } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn, SaltItem, SaltItemEdit } from '@snewbie/salt-ui-vue'
import { IconClear } from '@/icons'
import { Preferences } from '@capacitor/preferences';

const model = reactive({
    amapWebApiKey: '',
});
const router = useRouter()

onBeforeMount(async () => {
    const { value } = await Preferences.get({ key: 'Mine.Settings.AmapWebApiKey' })
    model.amapWebApiKey = value || ''
})

const onBack = () => {
    router.push('/tabs/mine')
};

const onAmapWebApikeyEditChange = async () => {
    const newValue = model.amapWebApiKey
    await Preferences.set({ key: 'Mine.Settings.AmapWebApiKey', value: newValue })
}

onIonViewWillLeave(() => {
    window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped></style>