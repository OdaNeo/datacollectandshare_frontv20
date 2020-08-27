import { VueConstructor } from 'vue';
import utils from "../utils"

const util = (target: VueConstructor):void => {
  target.prototype["h_utils"] = new utils()
}

export default util