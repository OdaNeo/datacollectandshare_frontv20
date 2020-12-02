

class TopicValidator{

  //字段名校验规则
  public readonly fieldKeyVilidata = (topicList:any[]) => {
    return [
      (v:string) =>!!v||"字段名不能为空",
      // (v:string) =>{
      //     let valNum = 0;
      //     topicList.forEach((element:any) => {
      //         if(v&&v===element.key){
      //             valNum++
      //         }
      //     });
      //     if(valNum>1){
      //         return "数据结构不能有重复的字段名"
      //     }
      //     return true
      // }
    ]
  }

  //描述校验规则
  public readonly fieldDescriptionValidator = () => {
    return [
      (v:string) => !!v||"字段描述不能为空"
    ]
  }

  //字段类型校验规则
  public readonly fieldTypeValidator = () => {
    return [
      (v:string) => !!v||"请选择字段类型"
    ]
  }

  //字段序号校验规则
  public readonly fieldNumVilidata = (topicList:any[]) => {
    return [
      (v: string) => !!v || "字段序号不能为空",
      (v: string) => (v && v.length <= 20) || "字段序号最长可设置20个字符",
      (v:string) => /^[0-9]*[1-9][0-9]*$/.test(v)|| "字段序号只能为正整数",
      (v:string) =>{
          let valNum = 0;
          topicList.forEach((element:any) => {
              if(v==element.number){
                  valNum++
              }
          });
          if(valNum>1){
              return "不能有重复的字段序号"
          }
          return true
      }
    ]
  }

  //主题名称校验规则
  public readonly topicNameVilidata = () => {
    return [
      (v:string) =>!!v||"主题名称不能为空",
      (v:string) =>(v&&v.length<=20) || "主题名称最长可设置20个字符",
      (v:string) => /^\w*$/.test(v) || "内容只能为数字、字母、下划线的组合"
    ]
  }

  //数据库地址校验规则
  public readonly dataBaseUrlVilidata = () => {
    return [
      (v:string) =>!!v||"数据库地址不能为空"
    ]
  }

  //数据库类型校验规则
  public readonly dataBaseTypeVilidata = () => {
    return [
      (v:string) =>!!v||"请选择数据库类型"
    ]
  }

  //url校验规则
  public readonly urlVilidata = () => {
    return [
      (v:string) =>!!v||"url不能为空"
    ]
  }

  //头信息校验规则
  public readonly headerKeyVilidata = () => {
    return [
      (v:string) =>!!v||"头信息键不能为空"
    ]
  }

  public readonly headerValueVilidata = () => {
    return [
      (v:string) =>!!v||"头信息值不能为空"
    ]
  }

  //消息类型校验规则
  public readonly messageTypeVilidata = () => {
    return [
      (v:string) =>!!v||"请选择消息类型"
    ]
  }

  //是否写入es校验规则
  public readonly writeEsVilidata = () => {
    return [
      (v:string) =>!!v||"请选择是否写入ES"
    ]
  }

  private isJSON(str:string) {
      if (typeof str == 'string') {
          try {
              var obj=JSON.parse(str);
              if(typeof obj == 'object' && obj ){
                  return true;
              }else{
                  return false;
              }

          } catch(e) {
              console.log('error：'+str+'!!!'+e);
              return false;
          }
      }
      console.log('It is not a string!')
  }

  //数据结构校验规则
  public readonly dataStructVilidata = () => {
    return [
      (v:string) =>!!v||"数据结构不能为空",
      (v:string) =>this.isJSON(v)||"请输入正确的Json数据"
    ]
  }

    public readonly typeVilidata = () => {
        return [
            (v:string) =>!!v||"请选择请求类型"
        ]
    }
    public readonly bodyVilidata = () => {
        return [
            (v:string) =>!!v||"body数据结构不能为空",
            (v:string) =>this.isJSON(v)||"请输入正确的Json数据"
        ]
    }
    //baseUrl
  public readonly baseUrlVilidata = () => {
    return [
      (v:string) =>!!v||"baseUrl不能为空"
    ]
  }
  //host校验规则
  public readonly hostVilidata = () => {
    return [
      (v:string) =>!!v||"host不能为空"
    ]
  }
  //port校验规则
  public readonly portVilidata = () => {
    return [
      (v:string) =>!!v||"port不能为空"
    ]
  }
  //FTP账号校验规则
  public readonly ftpNameVilidata = () => {
    return [
      (v:string) =>!!v||"FTP账号不能为空"
    ]
  }
  //FTP密码校验规则
  public readonly ftpPasswordVilidata = () => {
    return [
      (v:string) =>!!v||"FTP密码不能为空"
    ]
  }
}


export default TopicValidator
