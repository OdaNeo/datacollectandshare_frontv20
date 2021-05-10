export type log_statistics = {
  name:string,
  topicId:number,
  value:number,
  latest?:string,
  earliest?:string,
  follow?:boolean,
  uid?: number,
  flag?:boolean
}