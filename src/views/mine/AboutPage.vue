<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar text="关于" @back="onBack" />
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-img class="logo" src="/favicon.png" alt="App Logo"></ion-img>

            <salt-item-outer-large-title>
                <template #text>{{ appInfo.name }}<sup class="version">{{ appInfo.version }}</sup></template>
                {{ appInfo.description }}
            </salt-item-outer-large-title>

            <salt-rounded-column>
                <salt-yes-no-dialog v-model:open="model.changeLogDialog.open" title="访问链接"
                    :content="model.changeLogDialog.url" cancel-text="取消" confirm-text="确定"
                    @confirm="jump2(model.changeLogDialog.url)"></salt-yes-no-dialog>
                <salt-item text="更新日志" @click="model.changeLogDialog.open = true"></salt-item>
            </salt-rounded-column>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonContent, IonImg } from '@ionic/vue';
import { SaltTitleBar, SaltItemOuterLargeTitle, SaltRoundedColumn, SaltYesNoDialog, SaltItem } from '@snewbie/salt-ui-vue'
import { Browser } from '@capacitor/browser';

const appInfo = {
    name: __APP_NAME__,
    version: __APP_VERSION__,
    description: __APP_DESCRIPTION__,
}

const model = reactive({
    changeLogDialog: {
        open: false,
        url: 'https://github.com/null-object-0000/go-unknown/releases',
    },
});

const router = useRouter()

const onBack = () => {
    router.push('/tabs/mine')
};

const jump2 = async (url: string) => {
    await Browser.open({ url });
};
</script>

<style scoped>
.logo {
    width: 50px;
    height: 50px;
    margin: 0 auto;
    display: block;
    padding-top: calc(var(--salt-dimen-content-padding) * 1.5);
}

.salt-item-outer-large-title {
    padding-top: calc(var(--salt-dimen-content-padding) * 1.5);
}

.version {
    font-size: var(--salt-text-style-sub-font-size);
    line-height: var(--salt-text-style-sub-line-height);

    position: relative;
    right: -0.5em;
    background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>