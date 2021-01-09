import { VueConstructor } from 'vue'
import Utils from '../utils'

const util = (target: VueConstructor): void => {
  target.prototype.h_utils = new Utils()
}

export default util
