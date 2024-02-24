<template>
    <ion-page>
        <template v-if="model.mode === 'default'">
            <ion-header class="ion-no-border">
                <salt-title-bar text="账号绑定" @back="onBack" />
            </ion-header>
            <ion-content :fullscreen="true">
                <salt-rounded-column>
                    <salt-yes-no-dialog v-model:open="model.unbindDialog.open" title="要账号解绑吗？" cancel-text="取消"
                        confirm-text="确定" @open="statusBar.onDialogOpen" @close="statusBar.onDialogClose"
                        @confirm="unbind(model.unbindDialog.key)" />
                    <salt-item-switcher v-model="model.state.daMai.effective" text="大麦"
                        :sub="model.state.daMai.effective ? model.state.daMai.userName : '尚未绑定'"
                        @change="(value, _event) => change('daMai', value)" />
                    <salt-item-switcher v-model="model.state.tcTravel.effective" text="同程旅行"
                        :sub="model.state.tcTravel.effective ? model.state.tcTravel.userName : '尚未绑定'"
                        @change="(value, _event) => change('tcTravel', value)" />
                    <salt-item-switcher v-model="model.state.ctripTravel.effective" text="携程旅行"
                        :sub="model.state.ctripTravel.effective ? model.state.ctripTravel.userName : '尚未绑定'"
                        @change="(value, _event) => change('ctripTravel', value)" />
                    <salt-item-switcher v-model="model.state.govTrain12306.effective" text="铁路12306"
                        :sub="model.state.govTrain12306.effective ? model.state.govTrain12306.userName : '尚未绑定'"
                        @change="(value, _event) => change('govTrain12306', value)" />
                    <salt-input-dialog v-model="model.jiangSuEtcDialog.input" v-model:open="model.jiangSuEtcDialog.open"
                        title="X-APP-TOKEN" @open="statusBar.onDialogOpen" @close="statusBar.onDialogClose"
                        @confirm="model.jiangSuEtcDialog.check" />
                    <salt-item-switcher v-model="model.state.jiangSuEtc.effective" text="江苏ETC"
                        :sub="model.state.jiangSuEtc.effective ? model.state.jiangSuEtc.userName : '尚未绑定'"
                        @change="jiangSuEtcChange" />
                    <salt-item-switcher text="易捷加油" sub="暂不支持" :enabled="false" />
                    <salt-item-switcher v-model="model.state.jinDong.effective" text="京东"
                        :sub="model.state.jinDong.effective ? model.state.jinDong.userName : '尚未绑定'"
                        @change="(value, _event) => change('jinDong', value)" />
                </salt-rounded-column>
            </ion-content>
        </template>
        <template v-else-if="model.mode === 'web-view'">
            <ion-content :fullscreen="true" style="--background: transparent">
                <ion-progress-bar :value="progress"></ion-progress-bar>
                <div id="mainWebView" ref="mainWebViewRef" :style="{ width: '100%', height: '100%' }"></div>
            </ion-content>
        </template>
    </ion-page>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, reactive, ref } from 'vue';
import { IonPage, IonHeader, IonContent, IonProgressBar, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn, SaltItemSwitcher, SaltYesNoDialog, SaltInputDialog } from '@snewbie/salt-ui-vue'
import { WebView } from '@snewbie/capacitor-web-view';
import { isNotHybrid, usePreferences, useStatusBar } from '@/composables'
import {
    AbstractAccountBindService,
    DaMaiAccountBindService,
    TcTravelAccountBindService,
    CtripTravelAccountBindService,
    GovTrain12306AccountBindService,
    JiangSuEtcAccountBindService,
    JinDongAccountBindService
} from '@/services/AccountBindService'

interface State { effective: boolean; userName: string; cookies: string; value: string }

const router = useIonRouter()
const preferences = usePreferences()
const statusBar = useStatusBar()

const daMai = ref<State | null>(null);
const tcTravel = ref<State | null>(null);
const ctripTravel = ref<State | null>(null);
const govTrain12306 = ref<State | null>(null);
const jiangSuEtc = ref<State | null>(null);
const jinDong = ref<State | null>(null);

const model = reactive({
    mode: 'default' as 'default' | 'web-view',
    unbindDialog: { open: false, key: '' },
    jiangSuEtcDialog: {
        open: false, input: '',
        async check() {
            const { effective, userName, cookies, value } = await new JiangSuEtcAccountBindService().check(webView, model.jiangSuEtcDialog);

            if (!effective) return;
            if (!userName || !cookies || !value) return;

            model.state.jiangSuEtc.effective = true;
            model.state.jiangSuEtc.userName = userName;
            model.state.jiangSuEtc.cookies = cookies;
            model.state.jiangSuEtc.value = value;
            jiangSuEtc.value = model.state.jiangSuEtc;

            model.jiangSuEtcDialog.open = false;
        }
    },
    state: {
        daMai: {
            effective: false,
            userName: '',
            cookies: '',
            value: ''
        },
        tcTravel: {
            effective: false,
            userName: '',
            cookies: '',
            value: ''
        },
        ctripTravel: {
            effective: false,
            userName: '',
            cookies: '',
            value: ''
        },
        govTrain12306: {
            effective: false,
            userName: '',
            cookies: '',
            value: ''
        },
        jiangSuEtc: {
            effective: false,
            userName: '',
            cookies: '',
            value: ''
        },
        jinDong: {
            effective: false,
            userName: '',
            cookies: '',
            value: ''
        }
    } as { [key: string]: State }
})

onBeforeMount(async () => {
    await preferences.objectWatch('Mine.AccountBind.DaMai', daMai)
    await preferences.objectWatch('Mine.AccountBind.TcTravel', tcTravel)
    await preferences.objectWatch('Mine.AccountBind.CtripTravel', ctripTravel)
    await preferences.objectWatch('Mine.AccountBind.GovTrain12306', govTrain12306)
    await preferences.objectWatch('Mine.AccountBind.JiangSuEtc', jiangSuEtc)
    await preferences.objectWatch('Mine.AccountBind.JinDong', jinDong)

    model.state.daMai = daMai.value || model.state.daMai
    model.state.tcTravel = tcTravel.value || model.state.tcTravel
    model.state.ctripTravel = ctripTravel.value || model.state.ctripTravel
    model.state.govTrain12306 = govTrain12306.value || model.state.govTrain12306
    model.state.jiangSuEtc = jiangSuEtc.value || model.state.jiangSuEtc
    model.state.jinDong = jinDong.value || model.state.jinDong
})

const onBack = () => {
    if (router.canGoBack()) {
        router.back()
    } else {
        router.push('/tabs/mine')
    }
};

const checkTask = ref<NodeJS.Timeout>()

const change = async (key: string, state: boolean) => {
    if (isNotHybrid) {
        alert('请在 App 中进行操作') // TODO: replace with a toast
        setTimeout(() => model.state[key].effective = false, 250)
        return
    }

    let handler: AbstractAccountBindService;

    if (key === 'daMai') {
        handler = new DaMaiAccountBindService()
    } else if (key === 'tcTravel') {
        handler = new TcTravelAccountBindService()
    } else if (key === 'ctripTravel') {
        handler = new CtripTravelAccountBindService()
    } else if (key === 'govTrain12306') {
        handler = new GovTrain12306AccountBindService()
    } else if (key === 'jiangSuEtc') {
        handler = new JiangSuEtcAccountBindService()
    } else if (key === 'jinDong') {
        handler = new JinDongAccountBindService()
    } else {
        throw new Error('Unknown key')
    }

    if (state) {
        model.mode = 'web-view'

        await nextTick()
        await initWebView(handler.url)

        let onloadExecuted = false
        if (checkTask.value) clearInterval(checkTask.value)
        checkTask.value = setInterval(() => {
            if (!onloadExecuted && progress.value == 100) {
                if (typeof handler.onLoad === 'function') {
                    handler.onLoad(webView, model.state[key])
                }

                onloadExecuted = true
            }

            handler.check(webView, model.state[key]).then(async (args: { effective: boolean, userName?: string, cookies?: string, value?: string }) => {
                if (!args || !args.effective) return;
                if (!args.userName || !args.cookies || !args.value) return;

                clearInterval(checkTask.value)
                await webView.hide()
                webView.disableTouch()
                webView.destroy()

                model.state[key].effective = true
                model.state[key].userName = args.userName
                model.state[key].cookies = args.cookies
                model.state[key].value = args.value

                if (key === 'daMai') {
                    daMai.value = model.state[key]
                } else if (key === 'tcTravel') {
                    tcTravel.value = model.state[key]
                } else if (key === 'ctripTravel') {
                    ctripTravel.value = model.state[key]
                } else if (key === 'govTrain12306') {
                    govTrain12306.value = model.state[key]
                } else if (key === 'jiangSuEtc') {
                    jiangSuEtc.value = model.state[key]
                } else if (key === 'jinDong') {
                    jinDong.value = model.state[key]
                }

                model.mode = 'default'
            })
        }, 1500)
    } else {
        model.state[key].effective = true
        model.unbindDialog = { open: true, key }
    }
}

const jiangSuEtcChange = async () => {
    await nextTick()
    if (model.state.jiangSuEtc.effective) {
        model.state.jiangSuEtc.effective = false
        model.jiangSuEtcDialog.open = true
    } else {
        model.state.jiangSuEtc.effective = true
        model.unbindDialog = { open: true, key: 'jiangSuEtc' }
    }
}

const unbind = (key: string) => {
    model.state[key].effective = false
    model.state[key].userName = ''
    model.state[key].cookies = ''
    model.state[key].value = ''

    if (key === 'daMai') {
        daMai.value = null
    } else if (key === 'tcTravel') {
        tcTravel.value = null
    } else if (key === 'ctripTravel') {
        ctripTravel.value = null
    } else if (key === 'govTrain12306') {
        govTrain12306.value = null
    } else if (key === 'jiangSuEtc') {
        jiangSuEtc.value = null
    } else if (key === 'jinDong') {
        jinDong.value = null
    }
}

const mainWebViewRef = ref<HTMLElement | null>(null)

let webView: WebView;

let progress = ref(0);

const initWebView = async (url: string | null) => {
    if (model.mode !== 'web-view') return;
    if (!mainWebViewRef.value) return;
    if (!url) return;

    webView = await WebView.create({
        id: 'main',
        element: mainWebViewRef.value,
        config: { url }
    });

    await webView.enableTouch()
    await webView.setOnPageStartedListener(() => {
        progress.value = 0;
    })
    await webView.setOnPageFinishedListener(() => {
        progress.value = 100;
    })
    await webView.setOnProgressChangedListener(({ newProgress }: { newProgress: number }) => {
        progress.value = newProgress;
    })
}


onIonViewWillLeave(async () => {
    window.SaltUI.clearAllRippleAnimate()
    if (checkTask.value) clearInterval(checkTask.value)
    webView?.destroy()
})
</script>

<style scoped></style>