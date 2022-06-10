/**
 * @Description:
 * @Author liaoxuewu
 * @create 2022/4/12 21:54
 */
import modules from './modules'
import Vue from 'vue'
// 这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router'

Vue.use(Router)
// 初始化
const router = new Router({
  APP: {
    holdTabbar: false //默认是true
  },
  routes: [...modules] // 路由表
})

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  console.log(to.path)
  // if (to.name === 'login') {
  //   next()
  // }
  // if (to.name === 'main') {
  //   next(to.path)
  // }
  next()
  // next({
  //   name: 'system',
  //   params: {
  //     msg: '我拦截了tab5并重定向到了路由4页面上'
  //   },
  //   NAVTYPE: 'push'
  // })
})
// 全局路由后置守卫
router.afterEach((to, from) => {})
export default router
