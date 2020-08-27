import { VueConstructor } from "vue/types/umd";
import HttpInit from "../api/httpDecoratorInit"
import RequestData from '../api';
import Echarts from 'echarts'
import 'echarts-liquidfill'

const protoInstall = {
  install: (Vue: VueConstructor, options: any):void => {
    Vue.prototype.$request = new RequestData()
    Vue.prototype.$echarts = Echarts
  }
}

export default protoInstall