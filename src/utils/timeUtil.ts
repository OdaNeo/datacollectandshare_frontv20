class timeUtil {
  public static stamptoTime = (stamp: string | number, Reg: string): string => {
    const date: Date = new Date(Number(stamp))
    const year: number = date.getFullYear()
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0')
    const day: string = date.getDate().toString().padStart(2, '0')
    return Reg ? year + Reg + month + Reg + day : year + '/' + month + '/' + day
  }

  public static stampToTodayTime = (stamp: string | number): string => {
    const date: Date = new Date(Number(stamp))
    const hours: string = date.getHours().toString().padStart(2, '0')
    const minutes: string = date.getMinutes().toString().padStart(2, '0')
    const seconds: string = date.getSeconds().toString().padStart(2, '0')
    return hours + ':' + minutes + ':' + seconds
  }

  public static timeToStamp = (time: string, Reg: string): number => {
    const date = time.replace(`/${Reg}/`, '/')
    return new Date(date).getTime()
  }

  public static stamptoFullTime = (stamp: string | number, Reg: string): string => {
    const date: Date = new Date(Number(stamp))
    const year: number = date.getFullYear()
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0')
    const day: string = date.getDate().toString().padStart(2, '0')
    const hours: string = date.getHours().toString().padStart(2, '0')
    const minutes: string = date.getMinutes().toString().padStart(2, '0')
    const seconds: string = date.getSeconds().toString().padStart(2, '0')

    return Reg
      ? year + Reg + month + Reg + day + ' ' + hours + ':' + minutes + ':' + seconds
      : year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds
  }
}

export default timeUtil
