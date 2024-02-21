import usePreferences from '@/composables/Preferences'
import useStatusBar from '@/composables/StatusBar'
import { isPlatform } from '@ionic/vue';

const isHybrid = isPlatform('hybrid');
const isNotHybrid = !isHybrid;

export { isHybrid, isNotHybrid, usePreferences, useStatusBar }
