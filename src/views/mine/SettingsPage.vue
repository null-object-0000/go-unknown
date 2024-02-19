<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar text="通用设置" @back="onBack" />
        </ion-header>
        <ion-content :fullscreen="true">
            <salt-rounded-column>
                <salt-yes-no-dialog v-model:open="model.clearCacheDialog" title="要清除所有缓存数据吗？" cancel-text="取消"
                    confirm-text="确定" @open="statusBar.onDialogOpen" @close="statusBar.onDialogClose"
                    @confirm="clearAllCache" />
                <salt-item text="清除缓存" @click="model.clearCacheDialog = true" :enabled="model.hasCache">
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
import { SaltTitleBar, SaltRoundedColumn, SaltItem, SaltItemEdit, SaltYesNoDialog } from '@snewbie/salt-ui-vue'
import { IconClear } from '@/icons'
import { Preferences } from '@capacitor/preferences';
import { WebView } from '@snewbie/capacitor-web-view';
import { useStatusBar } from '@/hooks'

const model = reactive({
    hasCache: false,
    clearCacheDialog: false,
    amapWebApiKey: '',
});
const router = useRouter()
const statusBar = useStatusBar()

onBeforeMount(async () => {
    const { value } = await Preferences.get({ key: 'Mine.Settings.AmapWebApiKey' })
    model.amapWebApiKey = value || ''

    model.hasCache = await checkHasCache()
})

const onBack = () => {
    router.push('/tabs/mine')
};

const checkHasCache = async () => {
    const hasCookies = await WebView.hasCookies()
    return hasCookies
}

const clearAllCache = async () => {
    await WebView.removeAllCookies()

    model.hasCache = await checkHasCache()
}

const onAmapWebApikeyEditChange = async () => {
    const newValue = model.amapWebApiKey
    await Preferences.set({ key: 'Mine.Settings.AmapWebApiKey', value: newValue })
}

onIonViewWillLeave(() => {
    window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped></style>