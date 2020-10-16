import { alertStoreModule } from '../store/modules/alert';

class alertUtil{
  public static open = (text:string,visible:boolean,color:string="info",timeout:number=3000) => {
    alertStoreModule.openAlert({
      text,
      visible,
      timeout,
      color
    })
  }

  public static close = () => {
    alertStoreModule.closeAlert()
  }
}

export default alertUtil