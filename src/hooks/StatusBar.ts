import { StatusBar, Style } from '@capacitor/status-bar';
import { isPlatform } from '@ionic/vue';
import { ref } from 'vue';

export default function useStatusBar() {
    // 注意这里的色值没有走 css 变量，所以需要手动设置
    const backgroundColor = {
        default: {
            light: '#F7F9FA',
            dark: '#0C0C0C',
        },
        dialog: {
            light: '#00000080',
            dark: '#0C0C0C',
        }
    }

    const scene = ref<'default' | 'dialog'>('default');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const isHybrid = isPlatform('hybrid');
    const isNotHybrid = !isHybrid;

    /**
     * 切换状态栏主题
     * @param dark 是否为深色主题
     */
    const toggleTheme = async (args?: { dark?: boolean | undefined, scene?: 'default' | 'dialog' }) => {
        if (isNotHybrid) return;

        args = args || {};

        if (args.scene) {
            scene.value = args.scene;
        }

        if (args.dark === null || args.dark === undefined) {
            args.dark = prefersDark.matches;
        }

        await StatusBar.setBackgroundColor({ color: args.dark ? backgroundColor[scene.value].dark : backgroundColor[scene.value].light });
        await StatusBar.setStyle({ style: Style.Light });
    };

    /**
     * 自动切换深色主题，监听 prefers-color-scheme
     */
    const autoDarkTheme = async () => {
        // 初始状态
        toggleTheme();
        // Listen for changes to the prefers-color-scheme media query
        prefersDark.addEventListener('change', (mediaQuery) => toggleTheme({ dark: mediaQuery.matches }));
    }

    const onDialogOpen = async () => {
        await toggleTheme({ scene: 'dialog' });
    };

    const onDialogClose = async () => {
        await toggleTheme({ scene: 'default' });
    };

    return {
        autoDarkTheme,
        toggleTheme,
        onDialogOpen,
        onDialogClose
    }
}