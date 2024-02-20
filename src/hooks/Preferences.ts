import { Preferences } from '@capacitor/preferences';
import { Ref, watch } from 'vue';

export default function usePreferences() {

    const mineWatch = async (key: string, refValue: Ref<string | null>) => {
        const result = await Preferences.get({ key })
        if (result.value !== null) {
            refValue.value = result.value
        }

        watch(refValue, async (newValue) => {
            if (newValue === null) {
                await Preferences.remove({ key })
            } else {
                await Preferences.set({ key, value: newValue })
            }
        })
    }

    const mineObjectWatch = async (key: string, refValue: Ref<object | null>) => {
        const result = await Preferences.get({ key })
        if (result.value !== null) {
            refValue.value = JSON.parse(result.value)
        }

        watch(refValue, async (newValue) => {
            if (newValue === null) {
                await Preferences.remove({ key })
            } else {
                await Preferences.set({ key, value: JSON.stringify(newValue) })
            }
        })
    }

    return {
        watch: mineWatch,
        objectWatch: mineObjectWatch
    }
}