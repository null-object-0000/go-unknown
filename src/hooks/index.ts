import usePreferences from '@/hooks/Preferences'
import useStatusBar from '@/hooks/StatusBar'
import { isPlatform } from '@ionic/vue';

const isHybrid = isPlatform('hybrid');
const isNotHybrid = !isHybrid;

export { isHybrid, isNotHybrid, usePreferences, useStatusBar }
