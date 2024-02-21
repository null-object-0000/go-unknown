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
                        @confirm="handlers.jiangSuEtc.checker" />
                    <salt-item-switcher v-model="model.state.jiangSuEtc.effective" text="江苏ETC"
                        :sub="model.state.jiangSuEtc.effective ? model.state.jiangSuEtc.userName : '尚未绑定'"
                        @change="jiangSuEtcChange" />
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
import { IonPage, IonHeader, IonContent, IonProgressBar, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn, SaltItemSwitcher, SaltYesNoDialog, SaltInputDialog } from '@snewbie/salt-ui-vue'
import { WebView } from '@snewbie/capacitor-web-view';
import { isNotHybrid, usePreferences, useStatusBar } from '@/composables'
import { CapacitorHttp } from '@capacitor/core';

interface State { effective: boolean; userName: string; value: string }

const router = useIonRouter()
const preferences = usePreferences()
const statusBar = useStatusBar()

const daMai = ref<State | null>(null);
const tcTravel = ref<State | null>(null);
const ctripTravel = ref<State | null>(null);
const govTrain12306 = ref<State | null>(null);
const jiangSuEtc = ref<State | null>(null);

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
            const userName = keyValues.find(([key]) => key === 'nickName')?.[1]?.replace('+', ' ')
            const token = keyValues.find(([key]) => key === 'token')?.[1]

            log('getCookie', cookie)

            if (token && token.length > 0 &&
                userName && userName.length > 0) {
                model.state.tcTravel.effective = true
                model.state.tcTravel.userName = decodeURIComponent(userName)
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
    govTrain12306: {
        url: 'https://kyfw.12306.cn/otn/view/index.html',
        onLoad: async () => {
            await webView.evaluateJavascript(`document.querySelector('.login-box').scrollIntoView()`)
        },
        checker: async () => {
            const userNameDom = '#js-minHeight > div.welcome_data > div.welcome-tit > strong'

            const govTrain12306TK = await WebView.getCookie("https://kyfw.12306.cn", 'uKey')
            const govTrain12306UKey = await WebView.getCookie("https://kyfw.12306.cn/otn", 'tk')
            const cookie = govTrain12306TK && govTrain12306TK.length > 0 && govTrain12306UKey && govTrain12306UKey.length > 0
                ? JSON.stringify({ govTrain12306TK, govTrain12306UKey }) : undefined
            const userName = JSON.parse(await webView.evaluateJavascript(`document.querySelector("${userNameDom}")?.textContent`) || 'null')

            log('getCookie', govTrain12306TK + ' ' + govTrain12306UKey + ' ' + userName)

            if (cookie && cookie.length > 0 &&
                userName && userName.length > 0 && userName !== 'null') {
                model.state.govTrain12306.effective = true
                model.state.govTrain12306.userName = userName
                model.state.govTrain12306.value = cookie

                govTrain12306.value = model.state.govTrain12306
                return true
            } else {
                return false
            }
        }
    },
    jiangSuEtc: {
        url: 'https://etctoll.etczs.net',
        checker: async () => {
            const token = model.jiangSuEtcDialog.input

            if (token && token.length > 0) {
                model.state.jiangSuEtc.effective = true
                model.state.jiangSuEtc.value = token

                const response = await CapacitorHttp.post({
                    url: "https://etctoll.etczs.net/etctollsapi/tolls/truck/bill/carlist",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': 'https://servicewechat.com/wxb17f5d5d01db8949/1317/page-frame.html',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/7.0.20.1781 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/10448',
                        'xweb_xhr': '1',
                        'X-APP-ID': '1',
                        'X-APP-VER': '6.4.240114',
                        'X-APP-TOKEN': token
                    }
                })

                const { data } = response.data as { data: { plateNo: string }[] }

                const userName = data && data.length > 0 ? data[0].plateNo : null
                if (!userName || userName.length === 0) {
                    alert('X-APP-TOKEN 无效，请重新输入') // TODO: replace with a toast
                    return false
                }

                model.state.jiangSuEtc.userName = userName
                jiangSuEtc.value = model.state.jiangSuEtc
                return true
            } else {
                return false
            }
        }
    },
} as { [key: string]: { url: string; onLoad?: () => Promise<void>; checker: () => Promise<boolean> } }

const model = reactive({
    mode: 'default' as 'default' | 'web-view',
    unbindDialog: { open: false, key: '' },
    jiangSuEtcDialog: { open: false, input: '' },
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
        },
        govTrain12306: {
            effective: false,
            userName: '',
            value: ''
        },
        jiangSuEtc: {
            effective: false,
            userName: '',
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

    model.state.daMai = daMai.value || model.state.daMai
    model.state.tcTravel = tcTravel.value || model.state.tcTravel
    model.state.ctripTravel = ctripTravel.value || model.state.ctripTravel
    model.state.govTrain12306 = govTrain12306.value || model.state.govTrain12306
    model.state.jiangSuEtc = jiangSuEtc.value || model.state.jiangSuEtc
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

    const handler = handlers[key]

    if (state) {
        model.mode = 'web-view'

        await nextTick()
        await initWebView(handler)

        let onloadExecuted = false
        checkTask.value ?? clearInterval(checkTask.value)
        checkTask.value = setInterval(() => {
            if (!onloadExecuted && progress.value == 100) {
                if (typeof handler.onLoad === 'function') {
                    handler.onLoad()
                }

                onloadExecuted = true
            }

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