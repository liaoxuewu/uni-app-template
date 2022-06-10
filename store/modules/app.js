// import {
// 	request
// } from '@/js_sdk/uni-admin/request.js'

// #ifndef VUE3
const statConfig = require('uni-stat-config').default || require('uni-stat-config')
// #endif

export default {
  namespaced: true,
  state: {
    homeList: [], // 首页列表数据
    systemInfo: [] // 系统信息，视口的宽高等
  },
  getters: {
    // 获取首页列表数据
    getHomeList(state) {
      return state.homeList
    },
    // 获取系统信息
    getSysInfo(state) {
      return state.systemInfo
    }
  },
  mutations: {
    // 设置首页列表数据
    SET_HOME_LIST: (state, homeList) => {
      console.log(homeList + 'vuex..........')
      state.homeList = homeList
    },
    // 设置系统信息
    SET_SYS_INFO: (state, systemInfo) => {
      state.systemInfo = systemInfo
    }
  },
  actions: {
    // init({
    // 	commit
    // }) {
    // 	return request('getCurrentUserInfo', {}, {
    // 		functionName: 'uni-id-cf'
    // 	}).then(res => {
    // 		const {
    // 			navMenu,
    // 			userInfo
    // 		} = res
    // 		// commit('SET_NAV_MENU', navMenu)
    // 		commit('user/SET_USER_INFO', userInfo, {
    // 			root: true
    // 		})
    // 	})
    // },
    // 设置首页列表数据方法，页面调用
    setHomeList({ commit }, homeList) {
      commit('SET_HOME_LIST', homeList)
    },
    // 设置系统信息方法
    setSysInfo({ commit }, systemInfo) {
      commit('SET_SYS_INFO', systemInfo)
    }
  }
}
