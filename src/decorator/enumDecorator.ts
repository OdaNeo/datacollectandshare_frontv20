import { VueConstructor } from 'vue'

type enumType = {
  tsFileName: string
  enumName: string
}

const Enum = (enums: Array<enumType>) => {
  return (target: VueConstructor): void => {
    if (!target.prototype.h_enum) {
      target.prototype.h_enum = {}
    }
    enums.forEach(e => {
      const example = require(`../enum/${e.tsFileName}`)
      if (example) {
        target.prototype.h_enum[e.enumName] = example[e.enumName]
      } else {
        console.log('添加的枚举不存在')
      }
    })
  }
}
export default Enum
