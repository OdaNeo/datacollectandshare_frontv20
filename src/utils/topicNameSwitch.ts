class TopicNameSwitch{
  public static change = (topicName:string,topicEnum:any):string => {
    return topicEnum[topicName]?topicEnum[topicName]:topicName
  }
}

export default TopicNameSwitch