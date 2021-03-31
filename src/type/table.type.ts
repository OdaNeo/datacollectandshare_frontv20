export type tableHeaderType = {
  text: string
  align: string
  value?: string
  width?: number
  slot?: string
  isHide?: boolean
  color?: string
  format?: (n: any) => string | number
}
