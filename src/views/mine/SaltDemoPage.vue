<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar text="Salt UI 演示" @back="onBack" />
        </ion-header>
        <ion-content :fullscreen="true">
            <salt-item-outer-large-title>
                <template #text>Hello, SaltUI<sup class="vue-superscript">Vue 3.0</sup></template>
                SaltUI（UI for Salt Player） 是提取自椒盐音乐的 UI 风格组件，用以快速生成椒盐音乐风格用户界面。本库将会广泛用以椒盐系列 App 开发，以达到快速开发目的
            </salt-item-outer-large-title>

            <salt-rounded-column>
                <salt-item-check>未选中按钮</salt-item-check>
                <salt-item-check :model-value="true">选中按钮</salt-item-check>
            </salt-rounded-column>

            <salt-rounded-column>
                <salt-item-title>控件</salt-item-title>
                <salt-item icon-painter="qr-code" text="标准 Item 控件，带图标（可选），副标题文本（可选）" sub="Item 控件的副标题"></salt-item>
                <salt-item-switcher icon-painter="verified" text="标准开关控件，带图标（可选），副标题文本（可选）"
                    sub="开关控件的副标题"></salt-item-switcher>
                <salt-item-container>
                    <salt-text-button>默认按钮 TextButton</salt-text-button>
                </salt-item-container>
            </salt-rounded-column>

            <salt-rounded-column title="其他样式测试">
                <salt-item text="标准 Item 控件" sub="Item 控件的副标题"></salt-item>
                <salt-item icon-painter="qr-code" text="标准 Item 控件"></salt-item>
                <salt-item :enabled="false" icon-painter="qr-code" text="标准 Item 控件" sub="已禁用"></salt-item>
                <salt-item text="标准 Item 控件"></salt-item>
                <salt-item-switcher text="标准开关控件" sub="开关控件的副标题"></salt-item-switcher>
                <salt-item-switcher :model-value="true" :enabled="false" icon-painter="verified" text="标准开关控件（禁用）"
                    sub="此开关状态被禁用"></salt-item-switcher>
                <salt-item-switcher :model-value="true" text="标准开关控件"></salt-item-switcher>
            </salt-rounded-column>

            <salt-rounded-column title="Value 组件">
                <salt-item-value text="Value 标题" sub="Value 内容"></salt-item-value>
                <salt-item-value text="Value 标题标题标题标题标题标题标题标题标题标题标题" sub="Value 内容内容内容内容"></salt-item-value>
            </salt-rounded-column>

            <salt-rounded-column title="Edit 组件">
                <salt-item-edit v-model="model.text" hint="HINT 这是输入框"></salt-item-edit>
                <salt-item-edit-password v-model="model.password" hint="HINT 这是密码输入框"></salt-item-edit-password>
            </salt-rounded-column>

            <salt-rounded-column>

            </salt-rounded-column>

            <salt-rounded-column title="Dialog 对话框">
                <salt-yes-no-dialog v-model:open="model.yesNoDialog" title="YesNoDialog" content="这是一个是否确认的对话框"
                    @dismissRequest="model.yesNoDialog = false" @confirm="model.yesNoDialog = false"></salt-yes-no-dialog>
                <salt-item text="YesNoDialog" @click="model.yesNoDialog = true"></salt-item>

                <salt-yes-dialog v-model:open="model.yesDialog" title="YesDialog" content="这是一个是否确认的对话框"
                    @dismissRequest="model.yesDialog = false"></salt-yes-dialog>
                <salt-item text="YesDialog" @click="model.yesDialog = true"></salt-item>

                <salt-input-dialog v-model:open="model.inputDialog.open" v-model="model.inputDialog.text" title="文本输入"
                    @dismissRequest="model.inputDialog.open = false"
                    @confirm="model.inputDialog.open = false"></salt-input-dialog>
                <salt-item text="InputDialog" @click="model.inputDialog.open = true"></salt-item>
            </salt-rounded-column>

            <salt-rounded-column>
                <salt-item-slider v-model="model.slider" icon-painter="qr-code" text="Slider 滑块"
                    :steps="2"></salt-item-slider>
            </salt-rounded-column>

            <salt-rounded-column outer title="猜你在找">
                <salt-item-outer>你好呀</salt-item-outer>
                <salt-item-spacer></salt-item-spacer>
            </salt-rounded-column>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonContent } from '@ionic/vue';
import {
    SaltTitleBar,
    SaltTextButton,
    SaltItemTitle, SaltItem, SaltItemSwitcher, SaltItemCheck, SaltItemValue, SaltItemEdit, SaltItemEditPassword, SaltItemSlider, SaltItemSpacer, SaltItemContainer,
    SaltItemOuterLargeTitle, SaltItemOuter,
    SaltRoundedColumn,
    SaltYesDialog, SaltYesNoDialog, SaltInputDialog,
} from '@snewbie/salt-ui-vue'

const model = reactive({
    text: '',
    password: '',
    yesNoDialog: false,
    yesDialog: false,
    inputDialog: {
        open: false,
        text: '',
    },
    slider: 0,
});

const router = useRouter()

const onBack = () => {
    router.push('/tabs/mine')
};
</script>

<style scoped>
.vue-superscript {
    color: var(--salt-text-style-sub-color);
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