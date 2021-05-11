export type ResourcesFormObj = {
  name: string
  url: string
  parentid: number
  type: string
  id?: string
  [key: string]: string | number | undefined
}

export type ResourcesItem = {
  name: string
  url: string
  type: string
  id: string
  grandparentid?: number
  parentid: number | null
}

type childrenList = {
  id: number
  name: string
  parentid: number
  type: string
  url: string
}

interface resourcesChildren {
  id: number
  name: string
  parentid: number
  type: string
  url: string
  childrenList: childrenList[]
}

export interface ResourcesDessertType {
  childrenList: resourcesChildren[]
  id: number
  name: string
  parentid: number
  type: string
  url: string
}
