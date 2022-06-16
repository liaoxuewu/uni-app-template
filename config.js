export default {
  // baseUrl: 'http://192.168.21.44:9001',
  // baseUrl: 'http://192.168.8.101:8080',
  // http://192.168.8.101:9010
  // baseUrl: 'http://61.177.141.230:17401',
  login: {
    url: '/pages/login/login' // 登录页面路径
  },
  index: {
    url: '/pages/ip-info-main/ip-info-main' // 登录后跳转的第一个页面
  },
  error: {
    url: '/pages/error/404' // 404 Not Found 错误页面路径
  },
  navBar: {
    // 顶部导航
    logo: '/static/logo.png', // 左侧 Logo
    links: [
      {
        text: '',
        lang: 'zh-Hans'
      }
    ]
    // debug: {
    // 	enable: process.env.NODE_ENV !== 'production', //是否显示错误信息
    // }
  },
  sideBar: {
    // 左侧菜单
    // 配置静态菜单列表（放置在用户被授权的菜单列表下边）
    staticMenu: [
      {
        menu_id: 'home',
        text: '患者',
        icon: 'iconfont icon-tuandui4',
        url: '/pages/ip-info-home/ip-info-home'
      },
      // {
      // 	menu_id: "ip-message",
      // 	text: '消息',
      // 	icon: 'iconfont icon-pinglun',
      // 	url: "/pages/ip-message/ip-message"
      // },
      {
        menu_id: 'system',
        text: '设置',
        icon: 'iconfont icon-shezhi_2',
        url: 'pages/ip-system/ip-system'
      }
    ]
  }
}
