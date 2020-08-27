import RequestData from './index';
class Init{
  public static requestData: RequestData
  // public static httpAll:HttpAll
  public static httpRequestInit() {
    Init.requestData = new RequestData()
  }
}

export default Init