/**
 * @Description:
 * @Author liaoxuewu
 * @create 2022/4/12 21:54
 */
const home = [
  {
    // 注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
    path: '/pages/ip-info-main/ip-info-main',
    aliasPath: '/', // 对于h5端你必须在首页加上aliasPath并设置为/
    // 可以自定义路由元信息
    myDiy: {
      isTab: true
    },
    name: 'main',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/pages/login/login',
    name: 'login',
    meta: {
      title: '登陆'
    }
  },
  {
    path: '/pages/ip-info-detail/ip-info-detail',
    name: 'detail',
    meta: {
      title: '详情'
    }
  },
  {
    path: '/pages/ip-system/ip-system',
    name: 'system',
    meta: {
      title: '系统'
    }
  }
]
export default home
