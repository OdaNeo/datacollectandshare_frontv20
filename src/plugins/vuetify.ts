import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg'
  },
  theme: {
    themes: {
      light: {
        primary: '#1890ff',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#f5222d',
        info: '#1890ff',
        success: '#52c41a',
        warning: '#faad14'
      },
      dark: {
        primary: '#1890ff',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#f5222d',
        info: '#1890ff',
        success: '#52c41a',
        warning: '#faad14'
      }
    }
  }
})
