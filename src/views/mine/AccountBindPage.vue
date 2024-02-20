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
                    <salt-item-switcher text="铁路12306" sub="暂不支持" :enabled="false" />
                    <salt-item-switcher text="江苏ETC" sub="暂不支持" :enabled="false" />
                    <salt-item-switcher text="易捷加油" sub="暂不支持" :enabled="false" />
                </salt-rounded-column>
            </ion-content>
        </template>
        <template v-else-if="model.mode === 'web-view'">
            <ion-content :fullscreen="true" style="--background: transparent">
                <ion-progress-bar :value="progress"></ion-progress-bar>
                <div id="mainWebView" ref="mainWebViewRef" :style="{ width: '100%', height: '65%' }"></div>
                <div :style="{ width: '100%', height: '35%', fontSize: '11px', padding: '0 10px' }">
                    <p v-for="log of logs" v-html="log"></p>
                </div>
            </ion-content>
        </template>
    </ion-page>
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonContent, IonProgressBar, onIonViewWillLeave } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn, SaltItemSwitcher, SaltYesNoDialog } from '@snewbie/salt-ui-vue'
import { WebView } from '@snewbie/capacitor-web-view';
import { isNotHybrid, usePreferences, useStatusBar } from '@/hooks'

interface State { effective: boolean; userName: string; value: string }

const router = useRouter()
const preferences = usePreferences()
const statusBar = useStatusBar()

const daMai = ref<State | null>(null);
const tcTravel = ref<State | null>(null);
const ctripTravel = ref<State | null>(null);

const handlers = {
    daMai: {
        url: 'https://m.damai.cn/damai/minilogin/index.html?returnUrl=https%3A%2F%2Fm.damai.cn%2Fshows%2Fmine.html%3Fspm%3Da2o71.home.top.duserinfo&spm=a2o71.mydamai.0.0',
        checker: async () => {
            const cookie2 = await WebView.getCookie('https://m.damai.cn', 'cookie2')
            const dm_nickname = await WebView.getCookie('https://m.damai.cn', 'dm_nickname')

            log('getCookie', cookie2)

            if (cookie2 && cookie2.length > 0 &&
                dm_nickname && dm_nickname.length > 0) {
                model.state.daMai.effective = true
                model.state.daMai.userName = dm_nickname
                model.state.daMai.value = cookie2

                daMai.value = model.state.daMai
                return true
            } else {
                return false
            }
        }
    },
    tcTravel: {
        url: 'https://m.ly.com/passport/login.html?returnUrl=%2fmember%2f',
        checker: async () => {
            const cookie = await WebView.getCookie('https://m.ly.com', 'cnUser')

            const keyValues = cookie.split('&').map(item => item.split('='))
            const userName = keyValues.find(([key]) => key === 'nickName')?.[1]
            const token = keyValues.find(([key]) => key === 'token')?.[1]

            log('getCookie', cookie)

            if (token && token.length > 0 &&
                userName && userName.length > 0) {
                model.state.tcTravel.effective = true
                model.state.tcTravel.userName = userName || ''
                model.state.tcTravel.value = token

                tcTravel.value = model.state.tcTravel
                return true
            } else {
                return false
            }
        }
    },
    ctripTravel: {
        url: 'https://m.ctrip.com/webapp/myctrip',
        checker: async () => {
            const userNameDom = '#main > div > div.rn-scroller-vert.rn-view > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div.rn-text'

            const cticket = await WebView.getCookie('https://m.ctrip.com', 'cticket')
            const userName = JSON.parse(await webView.evaluateJavascript(`document.querySelector("${userNameDom}")?.textContent`) || 'null')

            log('getCookie', cticket)

            if (cticket && cticket.length > 0 &&
                userName && userName.length > 0 && userName !== 'null') {
                model.state.ctripTravel.effective = true
                model.state.ctripTravel.userName = userName
                model.state.ctripTravel.value = cticket

                ctripTravel.value = model.state.ctripTravel
                return true
            } else {
                return false
            }
        }
    },
} as { [key: string]: { url: string; checker: () => Promise<boolean> } }

const model = reactive({
    mode: 'default' as 'default' | 'web-view',
    unbindDialog: { open: false, key: '' },
    state: {
        daMai: {
            effective: false,
            userName: '',
            value: ''
        },
        tcTravel: {
            effective: false,
            userName: '',
            value: ''
        },
        ctripTravel: {
            effective: false,
            userName: '',
            value: ''
        }
    } as { [key: string]: State }
})

onBeforeMount(async () => {
    await preferences.objectWatch('Mine.AccountBind.daMai', daMai)
    await preferences.objectWatch('Mine.AccountBind.tcTravel', tcTravel)
    await preferences.objectWatch('Mine.AccountBind.ctripTravel', ctripTravel)

    model.state.daMai = daMai.value || model.state.daMai
    model.state.tcTravel = tcTravel.value || model.state.tcTravel
    model.state.ctripTravel = ctripTravel.value || model.state.ctripTravel
})

const onBack = () => router.push('/tabs/mine');

const checkTask = ref<NodeJS.Timeout>()

const change = async (key: string, state: boolean) => {
    if (isNotHybrid) {
        alert('请在 App 中进行操作') // TODO: replace with a toast
        setTimeout(() => model.state[key].effective = false, 250)
        return
    }

    const handler = handlers[key]

    if (state) {
        model.mode = 'web-view'

        await nextTick()
        await initWebView(handler)

        checkTask.value ?? clearInterval(checkTask.value)
        checkTask.value = setInterval(() => {
            handler.checker().then(async (result: boolean) => {
                if (!result) return;

                clearInterval(checkTask.value)
                await webView.hide()
                webView.disableTouch()
                webView.destroy()
                model.mode = 'default'
            })
        }, 1500)
    } else {
        model.state[key].effective = true
        model.unbindDialog = { open: true, key }
    }
}

const unbind = (key: string) => {
    model.state[key].effective = false
    model.state[key].userName = ''
    model.state[key].value = ''

    if (key === 'daMai') {
        daMai.value = null
    } else if (key === 'tcTravel') {
        tcTravel.value = null
    } else if (key === 'ctripTravel') {
        ctripTravel.value = null
    }
}

const mainWebViewRef = ref<HTMLElement | null>(null)

let webView: WebView;

const logs = ref<string[]>([])
let progress = ref(0);

const log = (event: string, msg?: string) => {
    logs.value.unshift(`[${new Date().toLocaleTimeString()}][${event}]<br>${msg}`)
}

const initWebView = async (handler: { url: string, checker: () => Promise<boolean> }) => {
    if (model.mode !== 'web-view') return;
    if (!mainWebViewRef.value) return;

    webView = await WebView.create({
        id: 'main',
        element: mainWebViewRef.value,
        config: { url: handler.url }
    });

    await webView.enableTouch()
    await webView.setOnPageStartedListener(() => {
        progress.value = 0;
        log('onPageStarted')
    })
    await webView.setOnPageFinishedListener(() => {
        progress.value = 100;
        log('onPageFinished')
    })
    await webView.setOnProgressChangedListener(({ newProgress }: { newProgress: number }) => {
        progress.value = newProgress;
        log('onProgressChanged', `newProgress: ${newProgress}`)
    })
}


onIonViewWillLeave(async () => {
    window.SaltUI.clearAllRippleAnimate()
    checkTask.value ?? clearInterval(checkTask.value)
    webView?.destroy()
})
</script>

<style scoped></style>