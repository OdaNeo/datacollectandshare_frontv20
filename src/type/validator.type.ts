export type ValidatorType = Array<(v: string) => boolean | string> | Array<(v: File) => boolean | string>
