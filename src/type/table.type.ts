export type tableHeaderType = {
  text: string
  align: string
  value?: string
  width?: number
  slot?: string
  format?: (n: any) => string
}
