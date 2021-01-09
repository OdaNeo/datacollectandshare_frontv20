/* eslint-disable @typescript-eslint/no-var-requires */
class HValidator {
  private obj: any = {}

  private vnames: string[] = []

  constructor(vnames: string[]) {
    this.vnames = vnames
    this.assginClass()
  }

  public readonly getValidators = (): any => {
    const validatorObj: any = {}
    this.vnames.forEach((vname: string) => {
      if (this.obj[vname]) {
        validatorObj[vname] = this.obj[vname]
      }
    })
    return validatorObj
  }

  private assginClass() {
    const modulesFiles = require.context('../validator', true, /.ts$/)
    modulesFiles.keys().forEach((file: string) => {
      if (file !== './h-validator.ts') {
        const ClassName = require(file + '').default
        Object.assign(this.obj, new ClassName())
      }
    })
  }
}
export default HValidator
