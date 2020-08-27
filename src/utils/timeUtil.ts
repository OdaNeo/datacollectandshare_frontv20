class timeUtil{
  public static stamptoTime = (stamp: string, Reg: string):string => {
    const date: Date = new Date(Number(stamp))
    const year: number = date.getFullYear()
    const month: string = (date.getMonth() + 1).toString().padStart(2,"0")
    const day: string = date.getDay().toString().padStart(2,"0")
    return Reg?year+Reg+month+Reg+day:year+"/"+month+"/"+day
  }

  public static timeToStamp = (time: string, Reg: string): number => {
    let date = time.replace(`/${Reg}/`, '/')
    return new Date(date).getTime()
  }
}

export default timeUtil