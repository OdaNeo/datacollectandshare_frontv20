// 批量导入导出
const importAll = (context: any) => {
  const map: any = {}
  for (const key of context.keys()) {
    const keyArr = key.split('/')
    keyArr.shift() // 移除.
    map[keyArr.join('.').replace(/\.ts$/g, '')] = context(key)
  }

  return map
}
export default importAll(require.context('./', false, /\.ts$/))
