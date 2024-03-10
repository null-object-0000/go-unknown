<template>
    <ion-page>
        <ion-header class="ion-no-border">
            <salt-title-bar @back="onBack">
                <span class="text">订单集合</span>
                <icon-reload class="salt-icon refresh-button" @click="doLoad(true)"></icon-reload>
            </salt-title-bar>
            <ion-progress-bar v-if="model.loading" style="position: absolute;" type="indeterminate"></ion-progress-bar>
        </ion-header>
        <ion-content :fullscreen="true">
            <template v-for="item of model.orderList">
                <div class="create-time">{{ formatCreateTime(item.createTime) }}</div>

                <salt-rounded-column>
                    <order-item :category="item.category" :title="item.title" :first-desc="item.firstDesc"
                        :second-desc="item.secondDesc" :total-amount="item.totalAmount"
                        :show-order-status-desc="item.showOrderStatusDesc">
                    </order-item>
                </salt-rounded-column>
            </template>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonProgressBar, IonContent, onIonViewWillLeave, useIonRouter } from '@ionic/vue';
import { SaltTitleBar, SaltRoundedColumn } from '@snewbie/salt-ui-vue'
import OrderItem from '@/components/OrderItem.vue'
import { onBeforeMount, reactive } from 'vue';
import {
    RefOrder,
    DaMaiRefOrderService,
    TcTravelRefOrderService,
    CtripTravelRefOrderService,
    GovTrain12306RefOrderService,
    JiangSuEtcRefOrderService
} from '@/services/RefOrderService'
import { useDateFormat } from '@vueuse/core'
import { IconReload } from '@/icons'

const model = reactive({
    loading: false,
    orderList: [] as RefOrder[]
})

const router = useIonRouter()

const formatCreateTime = (createTime: Date) => useDateFormat(createTime, 'YYYY-MM-DD HH:mm:ss').value

const onBack = () => {
    if (router.canGoBack()) {
        router.back()
    } else {
        router.push('/tabs/mine')
    }
};

onBeforeMount(async () => {
    await doLoad()
})

const doLoad = async (clearCache = false) => {
    if (model.loading) return

    model.loading = true

    const daMaiOrderListTask = new DaMaiRefOrderService().queryList(clearCache)
    const tcTravelOrderListTask = new TcTravelRefOrderService().queryList(clearCache)
    const ctripTravelOrderListTask = new CtripTravelRefOrderService().queryList(clearCache)
    const govTrain12306OrderListTask = new GovTrain12306RefOrderService().queryList(clearCache)
    const jiangSuEtcOrderListTask = new JiangSuEtcRefOrderService().queryList(clearCache)

    Promise.all([
        daMaiOrderListTask,
        tcTravelOrderListTask,
        ctripTravelOrderListTask,
        govTrain12306OrderListTask,
        jiangSuEtcOrderListTask
    ]).then(args => {
        const orderList = args.flat()

        model.orderList = orderList.sort((a, b) => {
            return a.createTime > b.createTime ? -1 : 1
        })
    }).finally(() => {
        model.loading = false
    })
}

onIonViewWillLeave(() => {
    window.SaltUI.clearAllRippleAnimate()
})
</script>

<style scoped>
.refresh-button {
    position: absolute;
    right: calc(var(--salt-dimen-inner-horizontal-padding) + 16px)
}

.create-time {
    margin: calc(var(--salt-dimen-outer-vertical-padding) * 2) var(--salt-dimen-outer-horizontal-padding);
}
</style>