export type ResourcesFormObj = {
  name: string
  url: string
  parentid: number
  type: string
  id?: string
  [key: string]: string | number | undefined
}
