<template>
    <salt-ripple-effect :enabled="enabled" mix-blend-mode="exclusion"
        @click="(event: MouseEvent) => { if (enabled) emit('click', event) }">
        <div class="order-item" :class="[enabled ? 'enabled' : 'unenabled']">
            <div class="start">{{ category }}</div>
            <div style="flex: 1;">
                <div class="top">
                    <div class="center title">
                        {{ title }}
                    </div>
                    <div style="flex: 0 0 12px;"></div>
                    <div class="end">
                        <span style="font-size: 12px;">￥</span>{{ totalAmount }}
                    </div>
                </div>
                <div class="bottom">
                    <div class="center">{{ firstDesc }}</div>
                    <div style="flex: 0 0 12px;"></div>
                    <div class="end">
                        <template v-if="!secondDesc || secondDesc.length <= 0">
                            {{ showOrderStatusDesc }}
                        </template>
                    </div>
                </div>
                <div class="bottom" v-if="secondDesc && secondDesc.length > 0">
                    <div class="center">{{ secondDesc }}</div>
                    <div style="flex: 0 0 12px;"></div>
                    <div class="end">{{ showOrderStatusDesc }}</div>
                </div>
            </div>
        </div>
    </salt-ripple-effect>
</template>
  
<script setup lang="ts">
import { SaltRippleEffect } from '@snewbie/salt-ui-vue'

defineProps({
    enabled: {
        type: Boolean,
        required: false,
        default: true
    },
    category: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: true
    },
    firstDesc: {
        type: String,
        required: false,
    },
    secondDesc: {
        type: String,
        required: false,
    },
    totalAmount: {
        type: Number,
        required: false,
    },
    showOrderStatusDesc: {
        type: String,
        required: false,
    }
})

const emit = defineEmits(['click'])
</script>
  
<style scoped>
.order-item {
    width: 100%;
    min-height: 56px;
    padding: var(--salt-dimen-inner-vertical-padding) var(--salt-dimen-inner-horizontal-padding);
    display: flex;
    align-items: center;
}

.order-item .start {
    flex: 0 0 48px;
    display: flex;
    align-items: center;
    margin-right: var(--salt-dimen-content-padding);
    font-size: 11px;
}

.order-item .center {
    flex: 1;
}

.order-item .center.title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.order-item .top {
    display: flex;
    font-size: var(--salt-text-style-main-font-size);
    line-height: var(--salt-text-style-main-line-height);
    color: var(--salt-color-text);
    padding-bottom: 10px;
}

.order-item .bottom {
    display: flex;
    color: var(--salt-text-style-sub-color);
    font-size: var(--salt-text-style-sub-font-size);
    line-height: var(--salt-text-style-sub-line-height);

    color: var(--salt-color-sub-text);
}

.order-item .end {
    flex: 0 0 65px;
    text-align: right;
}

.order-item.unenabled {
    opacity: 0.5;
}

.order-item.unenabled .title {
    color: var(--salt-color-sub-text);
}
</style>