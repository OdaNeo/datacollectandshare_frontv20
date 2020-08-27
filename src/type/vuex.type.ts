export type userRootType = {
  available: string,
  childrenList?: Array<userRootType>
  gmtCreated: string,
  gmtUpdated: string,
  id: number ,
  name: string,
  parentid: number | null,
  parentids: string,
  percode: string ,
  sortstring: string | null,
  type: string ,
  url:string 
}

export type userMessageType = {
  loginName?: string,
  place?: string,
  systemName?: string,
  userState?: number,
  userToken?: string,
  userType?: number,
  userTypeName?:string
}