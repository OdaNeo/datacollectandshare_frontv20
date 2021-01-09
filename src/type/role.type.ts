export type RoleFormObj = {
  name?: string
  id?: string
  roles?: Array<number> | string
  [key: string]: string | undefined | Array<number>
}
