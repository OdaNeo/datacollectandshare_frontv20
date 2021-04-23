import Vue from 'vue'
import RequestData from '@/api/index'

const request = new RequestData()

// 搜索框仅数字
Vue.directive('onlyNum', {
  bind: function (el) {
    let ele: any[] | any = el.tagName.toUpperCase() === 'INPUT' ? el : el.querySelectorAll('input')
    switch (ele.length) {
      case 1:
        ele = ele[0]
        break
      case 2:
        ele = ele[1]
    }

    ele.oninput = function () {
      let val = ele.value
      val = val.replace(/[^0-9]/g, '') // 清除"数字"和"."以外的字符
      console.log(val)
      val = val.replace(/^0+/, '') // 首匹配去0
      // 不能超过init最大值
      if (val > 2147483647) {
        val = val.substring(0, val.length - 1) // 截取超过init的字符
      }
      ele.value = val
    }
  }
})
//
// 已经废弃 主题名不重复topicNameNoRepeat
// <!-- v-topicNameNoRepeat="{
//   set: n => {
//     noRepeat = [...n]
//   }
// }" -->
Vue.directive('topicNameNoRepeat', {
  bind: (el, binding) => {
    let ele: any[] | any = el.tagName === 'INPUT' ? el : el.querySelectorAll('input')
    switch (ele.length) {
      case 1:
        ele = ele[0]
        break
      case 2:
        ele = ele[1]
    }
    let timer = 0

    ele.oninput = async () => {
      if (!ele.value) {
        return
      }
      clearTimeout(timer)
      timer = setTimeout(async () => {
        const { success } = await request['httpGET']('GET_TOPICS_CHECKED', {
          topicName: ele.value
        })
        if (success) {
          binding.value.set(['主题名称已被注册'])
        } else {
          binding.value.set([])
        }
      }, 200)
    }
  }
})
