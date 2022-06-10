/**
 * @Description: 请求接口统一封装
 * @Author liaoxuewu
 * @create 2022/01/25 13:22
 */
import uniRequest from '@/components/uni-request/index.js'

// 全局配置
// uniRequest.defaults.baseURL = config.baseUrl;
// uniRequest.defaults.baseURL = uni.getStorageInfoSync('uni_base_url');
// uniRequest.defaults.baseURL = uni.getStorageInfoSync('uni_base_url');
console.log(uni.getStorageInfoSync('uni_base_url'))

uniRequest.timeout = 1000 * 60 // 请求超时时间

// 请求拦截
uniRequest.interceptors.request.use(
  request => {
    // 配置基本信息
    const userInfo = uni.getStorageSync('uni_user_info')
    console.log(userInfo.token + '----请求拦截获取token')
    if (userInfo) {
      const token = userInfo.token
      request.headers.Authorization = 'Bearer ' + token
    }
    return request
  },
  err => {
    console.log('请求失败')
    return Promise.reject(err)
  }
)

// 响应拦截
uniRequest.interceptors.response.use(
  function (response) {
    console.log('返回进入拦截成功')
    return Promise.resolve(response)
  },
  function (err) {
    if (err && err.response) {
      switch (err.response.status) {
        case 301:
          err.message = '请求的数据具有新的位置且更改是永久的'
          break
        case 302:
          err.message = '请求的数据临时具有不同 URI'
          break
        case 304:
          err.message = '未按预期修改文档'
          break
        case 305:
          err.message = '必须通过代理来访问请求的资源'
          break
        case 400:
          err.message = '请求中有语法问题，或不能满足请求'
          break
        case 402:
          err.message = '所使用的模块需要付费使用'
          break
        case 403:
          err.message = '当前操作没有权限'
          break
        case 404:
          err.message = '服务器找不到给定的资源'
          break
        case 407:
          err.message = '客户机首先必须使用代理认证自身'
          break
        case 415:
          err.message = '请求类型不支持，服务器拒绝服务'
          break
        case 417:
          err.message = '未绑定登录账号，请使用密码登录后绑定'
          break
        case 426:
          err.message = '用户名不存在或密码错误'
          break
        case 429:
          err.message = '请求过于频繁'
          break
        case 500:
          err.message = '服务器内部错误，无法完成请求'
          break
        case 501:
          err.message = '服务不支持请求'
          break
        case 502:
          err.message = '网络错误，服务器接收到上上游服务器无效响应'
          break
        case 503:
          err.message = '服务器无法处理请求'
          break
        case 504:
          err.message = '网络请求超时'
          break
        case 999:
          err.message = '系统未知错误，请反馈给管理员'
          break
      }
    } else {
      err.message = '连接服务器失败!'
    }
    console.log(err.message)
    return Promise.reject(err)
  }
)

export const POST = ({ url, params = {}, data = {}, headers = {}, ...others }) =>
  uniRequest({
    url,
    method: 'POST',
    data,
    params,
    headers,
    ...others
  })

export const GET = ({ url, params = {}, data = {}, headers = {}, ...others }) =>
  uniRequest({
    url,
    method: 'GET',
    data,
    params,
    headers,
    ...others
  })

export const DELETE = ({ url, params = {}, data = {}, headers = {}, ...others }) =>
  uniRequest({
    url,
    method: 'DELETE',
    data,
    params,
    headers,
    ...others
  })

export const PUT = ({ url, params = {}, data = {}, headers = {}, ...others }) =>
  uniRequest({
    url,
    method: 'PUT',
    data,
    params,
    headers,
    ...others
  })
