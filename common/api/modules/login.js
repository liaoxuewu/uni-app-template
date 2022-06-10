/**
 * @Description: 登录
 * @Author liaoxuewu
 * @create 2022/01/25 15:57
 */
import { POST } from '@/common/api/request.js'

const baseUrl = uni.getStorageSync('uni_base_url')
console.log(baseUrl + '登陆请求接口的服务器地址')

export default {
  /**
	 * @description: api登录请求
	 * @param {*}
	 * @return {*} 请求响应promise
	 */
  login(
    body = {
      baseUrl: '',
      params: {},
      data: {},
      headers: { 'content-type': 'application/json' }
    }
  ) {
    return POST({
      url: body.baseUrl + '/login/Login_CF',
      ...body,
      data: {
        ...body.data
      }
    })
  }
}
