class TopicNameSwitch {
  public static change = (topicName: string, topicEnum: never): string => {
    return topicEnum[topicName] ? topicEnum[topicName] : topicName
  }
}
export default TopicNameSwitch
