import { WebView } from '@snewbie/capacitor-web-view';
import { CapacitorHttp } from '@capacitor/core';

export abstract class AbstractAccountBindService {
    public url = null as string | null;

    public onLoad = async (webView: WebView, model: any) => { };

    public abstract check: (webView: WebView, model: any) => Promise<{ effective: boolean, userName?: string, cookies?: string, value?: string }>;
}

export class DaMaiAccountBindService extends AbstractAccountBindService {
    public url = 'https://m.damai.cn/damai/minilogin/index.html?returnUrl=https%3A%2F%2Fm.damai.cn%2Fshows%2Fmine.html%3Fspm%3Da2o71.home.top.duserinfo&spm=a2o71.mydamai.0.0';

    public check = async (webView: WebView, model: any) => {
        const cookies = await WebView.getCookie('https://m.damai.cn')
        const cookie2 = await WebView.getCookie('https://m.damai.cn', 'cookie2')
        const dm_nickname = await WebView.getCookie('https://m.damai.cn', 'dm_nickname')

        if (cookie2 && cookie2.length > 0 &&
            dm_nickname && dm_nickname.length > 0) {
            return { effective: true, userName: dm_nickname, cookies, value: cookie2 }
        } else {
            return { effective: false }
        }
    }
}

export class TcTravelAccountBindService extends AbstractAccountBindService {
    public url = 'https://m.ly.com/passport/login.html?returnUrl=%2fmember%2f';

    public check = async (webView: WebView, model: any) => {
        const cookies = await WebView.getCookie('https://m.ly.com')
        const cookie = await WebView.getCookie('https://m.ly.com', 'cnUser')

        const keyValues = cookie.split('&').map(item => item.split('='))
        const userName = keyValues.find(([key]) => key === 'nickName')?.[1]?.replace('+', ' ')
        const token = keyValues.find(([key]) => key === 'token')?.[1]

        if (token && token.length > 0 &&
            userName && userName.length > 0) {
            return { effective: true, userName: decodeURIComponent(userName), cookies, value: token }
        } else {
            return { effective: false }
        }
    }
}

export class CtripTravelAccountBindService extends AbstractAccountBindService {
    public url = 'https://m.ctrip.com/webapp/myctrip';

    public check = async (webView: WebView, model: any) => {
        const cookies = await WebView.getCookie('https://m.ctrip.com')

        const userNameDom = '#main > div > div.rn-scroller-vert.rn-view > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div.rn-text'

        const cticket = await WebView.getCookie('https://m.ctrip.com', 'cticket')
        const userName = JSON.parse(await webView.evaluateJavascript(`document.querySelector("${userNameDom}")?.textContent`) || 'null')

        if (cticket && cticket.length > 0 &&
            userName && userName.length > 0 && userName !== 'null') {
            return { effective: true, userName: userName, cookies, value: cticket }
        } else {
            return { effective: false }
        }
    }
}

export class GovTrain12306AccountBindService extends AbstractAccountBindService {
    public url = 'https://kyfw.12306.cn/otn/view/index.html';

    public onLoad = async (webView: WebView, model: any) => {
        await webView.evaluateJavascript(`document.querySelector('.login-box').scrollIntoView()`)
    }

    public check = async (webView: WebView, model: any) => {
        const cookies = await WebView.getCookie('https://kyfw.12306.cn/otn')

        const userNameDom = '#js-minHeight > div.welcome_data > div.welcome-tit > strong'

        const govTrain12306TK = await WebView.getCookie("https://kyfw.12306.cn", 'uKey')
        const govTrain12306UKey = await WebView.getCookie("https://kyfw.12306.cn/otn", 'tk')

        let cookie;
        if (govTrain12306TK && govTrain12306TK.length > 0 && govTrain12306UKey && govTrain12306UKey.length > 0) {
            cookie = JSON.stringify({ govTrain12306TK, govTrain12306UKey })
        }

        const userName = JSON.parse(await webView.evaluateJavascript(`document.querySelector("${userNameDom}")?.textContent`) || 'null')

        if (cookie && cookie.length > 0 &&
            userName && userName.length > 0 && userName !== 'null') {
            return { effective: true, userName: userName, cookies, value: cookie }
        } else {
            return { effective: false }
        }
    }
}

export class JiangSuEtcAccountBindService extends AbstractAccountBindService {
    public check = async (webView: WebView, model: any) => {
        const token = model.input as string | null

        console.log('token', token)

        if (token && token.length > 0) {
            const response = await CapacitorHttp.post({
                url: "https://etctoll.etczs.net/etctollsapi/tolls/truck/bill/carlist",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': 'https://servicewechat.com/wxb17f5d5d01db8949/1317/page-frame.html',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/7.0.20.1781 NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/10448',
                    'xweb_xhr': '1',
                    'X-APP-ID': '1',
                    'X-APP-VER': '6.4.240303',
                    'X-APP-TOKEN': token
                }
            })

            const { data } = response.data as { data: { userCardId: number, plateNo: string, provinceId: number }[] }

            const userCardId = data && data.length > 0 ? data[0].userCardId : null
            const plateNo = data && data.length > 0 ? data[0].plateNo : null
            const provinceId = data && data.length > 0 ? data[0].provinceId : null
            if (!plateNo || plateNo.length === 0) {
                alert('X-APP-TOKEN 无效，请重新输入') // TODO: replace with a toast
                return { effective: false }
            }

            return {
                effective: true, userName: plateNo,
                cookies: '',
                value: JSON.stringify({ token, userCardId, plateNo, provinceId })
            }
        } else {
            return { effective: false }
        }
    }
}

export class JinDongAccountBindService extends AbstractAccountBindService {
    public url = 'https://wqs.jd.com/my/accountv2.shtml';

    public check = async (webView: WebView, model: any) => {
        const cookies = await WebView.getCookie('https://wqs.jd.com')

        const pt_pin = await WebView.getCookie('https://wqs.jd.com', 'pt_pin')
        const pt_key = await WebView.getCookie('https://wqs.jd.com', 'pt_key')

        if (pt_pin && pt_pin.length > 0 &&
            pt_key && pt_key.length > 0) {
            return { effective: true, userName: decodeURIComponent(pt_pin), cookies, value: pt_key }
        } else {
            return { effective: false }
        }
    }
}