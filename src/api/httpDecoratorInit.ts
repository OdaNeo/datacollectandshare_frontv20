import RequestData from './index';
class Init{
  // public static requestData: RequestData
  // public static httpAll:HttpAll
  public httpRequestInit(headers?:Array<any>) {
    return new RequestData(headers?headers:[])
  }
}

export default Init