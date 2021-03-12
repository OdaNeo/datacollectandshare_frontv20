export type tableHeaderType = {
  text: string
  align: string
  value?: string
  slot?: string
  tab?: number | null
  format?: (n: any) => string
}
