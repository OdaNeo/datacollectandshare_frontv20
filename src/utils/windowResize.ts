class DevicePixelRatio {
  // 获取系统类型
  _getSystem(): boolean | void {
    const agent = navigator.userAgent.toLowerCase()
    // var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    // if(isMac) {
    // return false;
    // }
    // 现只针对windows处理，其它系统暂无该情况，如有，继续在此添加
    if (agent.indexOf('windows') >= 0) {
      return true
    }
  }

  // 获取页面缩放比例
  // _getDevicePixelRatio() {
  // let t = this;
  // }
  // 监听方法兼容写法
  _addHandler(element: Window | HTMLElement | any, type: string, handler: () => void): void {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  }

  // 校正浏览器缩放比例
  _correct(): void {
    const body = document.getElementsByTagName('body')[0]
    // 页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
    switch (window.devicePixelRatio) {
      case 1:
        body.style.zoom = '1'
        break
      case 1.25:
        body.style.zoom = '0.9'
        break
      case 1.5:
        body.style.zoom = '0.85'
        break
    }
  }

  // 监听页面缩放
  _watch(): void {
    this._addHandler(window, 'resize', () => {
      // 注意这个方法是解决全局有两个window.resize
      // 重新校正
      this._correct()
    })
  }

  // 初始化页面比例
  init(): void {
    if (this._getSystem()) {
      // 判断设备，目前只在windows系统下校正浏览器缩放比例
      // 初始化页面校正浏览器缩放比例
      this._correct()
      // 开启监听页面缩放
      this._watch()
    }
  }
}
export default DevicePixelRatio
