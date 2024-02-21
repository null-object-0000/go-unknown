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
                    <template #start><icon-clear class="salt-icon" /></template>
                </salt-item>
            </salt-rounded-column>
            <salt-rounded-column title="高德地图 Web 服务 Key">
                <salt-item-edit v-model="amapWebApiKey" />
            </salt-rounded-column>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { IonPage, IonHeader, IonContent, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn, SaltItem, SaltItemEdit, SaltYesNoDialog } from '@snewbie/salt-ui-vue'
import { IconClear } from '@/icons'
import { WebView } from '@snewbie/capacitor-web-view';
import { isNotHybrid, usePreferences, useStatusBar } from '@/composables'

const model = reactive({
    hasCache: false,
    clearCacheDialog: false,
});

const router = useIonRouter()
const preferences = usePreferences()
const statusBar = useStatusBar()

const amapWebApiKey = ref<string | null>(null);

onBeforeMount(async () => {
    await preferences.watch('Mine.Settings.AmapWebApiKey', amapWebApiKey)

    model.hasCache = await checkHasCache()
})

const onBack = () => {
    if (router.canGoBack()) {
        router.back()
    } else {
        router.push('/tabs/mine')
    }
};

const checkHasCache = async () => {
    if (isNotHybrid) return false
    return await WebView.hasCookies()
}

const clearAllCache = async () => {
    await WebView.removeAllCookies()

    model.hasCache = await checkHasCache()
}

onIonViewWillLeave(() => {
    window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped></style>