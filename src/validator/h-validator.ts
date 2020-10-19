type _this = {
  [key:string]:any
}

class HValidator{

  private obj:any = {}

  private vnames:string[] = []
  constructor(vnames: string[]) {
    this.vnames = vnames;
    this.assginClass()
  }

  public readonly getValidators = () => {
    let validatorObj: any = {}
    let _this: _this = this
    this.vnames.forEach((vname: string) => {
      if (_this.obj[vname]) {
        validatorObj[vname] = _this.obj[vname]
      }
    })
    return validatorObj
  }

  private assginClass() {
    const modulesFiles = require.context("../validator", true, /.ts$/)
    modulesFiles.keys().forEach((file: string) => {
      if (file != "./h-validator.ts") {
        const ClassName = require(file + "").default
        Object.assign(this.obj,new ClassName)
      }
    })
  }


}
export default HValidator