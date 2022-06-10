import './common/utils/global-prototype.js' // 挂在window 上 Number、Object、Array、String、原型
import App from './App'
import Vue from 'vue'
import uView from 'uview-ui'
// Vue.use(uView)
// 如此配置即可
uni.$u.config.unit = 'rpx'
// import router from './router'
// import { RouterMount } from 'uni-simple-router'
// import routerLink from './node_modules/uni-simple-router/component/router-link.vue'
// Vue.component('router-link', routerLink)

// 引入vuex
import store from './store'
// 把vuex定义成全局组件
Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App,
  // 挂载
  uView,
  store,
  // router,
  beforeCreate() {
    // 在全局添加一个属性
    Vue.prototype.$bus = this
  }
})
app.$mount()
// v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
// RouterMount(app, '#app')
// #endif

// #ifndef H5
// app.$mount() // 为了兼容小程序及app端必须这样写才有效果
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
