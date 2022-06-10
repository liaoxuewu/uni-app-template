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
        text: '患者',
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
      {
        menu_id: 'note',
        text: '快记',
        icon: 'iconfont icon-bianji_2',
        url: '/pages/ip-info-note/ip-info-note'
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
  },
  deptList: [ // 科室列表
    { name: '全科', icon: 'icon-quanke'},
    { name: '其他科', icon: 'icon-qitake'},
    { name: '康复科', icon: 'icon-kangfuke'},
    { name: '体检科', icon: 'icon-tijianke'},
    { name: '影像科', icon: 'icon-yingxiangke'},
    { name: '外科', icon: 'icon-waike'},
    { name: '传染科', icon: 'icon-chuanranke'},
    { name: '化验科', icon: 'icon-huayanke'},
    { name: '耳鼻喉科', icon: 'icon-erbihouke'},
    { name: '儿科', icon: 'icon-erke'},
    { name: '呼吸科', icon: 'icon-huxike'},
    { name: '营养科', icon: 'icon-yingyangke'},
    { name: '外六科(泌尿外科)', icon: 'icon-miniaoke'},
    { name: '口腔科', icon: 'icon-kouqiangke'},
    { name: '病理科', icon: 'icon-binglike'},
    { name: '男科', icon: 'icon-nanke'},
    { name: '皮肤科', icon: 'icon-pifuke'},
    { name: '骨科', icon: 'icon-guke'},
    { name: '肿瘤科', icon: 'icon-zhongliuke'},
    { name: '妇产科', icon: 'icon-fuchanke'},
    { name: '麻醉科', icon: 'icon-mazuike'},
    { name: '中医科', icon: 'icon-zhongyike'},
    { name: '眼科', icon: 'icon-yanke'},
    { name: '内科', icon: 'icon-neike'},
    { name: '生殖科', icon: 'icon-shengzhike'},
    { name: '内分泌科', icon: 'icon-neifenmike'},
    { name: '产科', icon: 'icon-chanke'},
    { name: '整形科', icon: 'icon-zhengxingke'},
    { name: '精神科', icon: 'icon-jingshenke'}
  ]
}
