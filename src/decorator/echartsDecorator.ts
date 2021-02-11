import { VueConstructor } from 'vue'
import Echarts from 'echarts'
import 'echarts-liquidfill'

const echarts = (target: VueConstructor): void => {
  target.prototype.h_echarts = Echarts
}

export default echarts
