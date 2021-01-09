import { VueConstructor } from 'vue'
import HValidator from '../validator/h-validator'

const validator = (vnames: string[]) => {
  return (target: VueConstructor): void => {
    if (!target.prototype.h_validator) {
      target.prototype.h_validator = {}
    }
    target.prototype.h_validator = new HValidator(vnames).getValidators()
  }
}

export default validator
