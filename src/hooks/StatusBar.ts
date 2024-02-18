import { ref } from 'vue';
import { StatusBar, Style } from '@capacitor/status-bar';
import { isPlatform } from '@ionic/vue';

export default function useStatusBar() {
    // 注意这里的色值没有走 css 变量，所以需要手动设置
    const backgroundColor = {
        light: '#F7F9FA',
        dark: '#0C0C0C',
        dialog: '#00000080'
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const defaultBackgroundColor = ref<string>()

    const isHybrid = isPlatform('hybrid');
    const isNotHybrid = !isHybrid;

    /**
     * 自动切换深色主题，监听 prefers-color-scheme
     */
    const autoDarkTheme = async () => {
        if (isNotHybrid) return;

        // 初始状态
        toggleDarkTheme(prefersDark.matches);
        // Listen for changes to the prefers-color-scheme media query
        prefersDark.addEventListener('change', (mediaQuery) => toggleDarkTheme(mediaQuery.matches));
    }

    /**
     * 切换状态栏主题
     * @param dark 是否为深色主题
     */
    const toggleDarkTheme = async (dark: boolean | undefined) => {
        if (isNotHybrid) return;

        await StatusBar.setBackgroundColor({ color: dark ? backgroundColor.dark : backgroundColor.light });
        await StatusBar.setStyle({ style: Style.Light });
    };

    const onDialogOpen = async () => {
        if (isNotHybrid) return;

        const statusBarInfo = await StatusBar.getInfo();
        defaultBackgroundColor.value = statusBarInfo.color;
        await StatusBar.setBackgroundColor({ color: backgroundColor.dialog });
    };

    const onDialogClose = async () => {
        if (isNotHybrid) return;

        if (defaultBackgroundColor.value) {
            await StatusBar.setBackgroundColor({ color: defaultBackgroundColor.value });
        }
    };

    return {
        autoDarkTheme,
        toggleDarkTheme,
        onDialogOpen,
        onDialogClose
    }
}