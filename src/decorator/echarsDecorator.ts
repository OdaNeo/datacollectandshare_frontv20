import { VueConstructor } from 'vue';
import Echarts from 'echarts';

const echarts = (target: VueConstructor):void => {
  target.prototype["h_echars"] = Echarts
}

export default echarts