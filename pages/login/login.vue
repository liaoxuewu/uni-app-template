<template>
  <view class="login-wrap">
    </view>
    <form class="login-form">
      <!-- 标题 -->
      <view class="login-title">
        <view class="login-title-back" v-if="!isShowLogin" @click="isShowLogin = true">
          <u-icon style="display: inline-block" name="arrow-left" color="#898D99"></u-icon>
        </view>
        {{ title }}
      </view>
      <view v-if="isShowLogin">
        <view class="login-form-item">
          <image class="item-left-img" src="@/static/account.png"></image>
          <input name="username" autocomplete="on" placeholder="请输入工号" maxlength="11" v-model="username" />
        </view>
        <view class="login-form-item">
          <image class="item-left-img" src="@/static/lock.png"></image>
          <input name="password" autocomplete="on" maxlength="20" placeholder="请输入密码" v-model="password" />
        </view>
        <view class="login-form-item" @click="onClickHospital">
          <picker @change="onChangeHospital" @cancel="onCancelHospital" :range="hospitalNames">
            <image class="item-left-img" src="@/static/hospital.png"></image>
            <input
              :disabled="true"
              style="height: 35rpx"
              autocomplete="on"
              name="hospital"
              maxlength="20"
              placeholder="请选择"
              v-model="hospital"
            />
            <image class="select-img" :src="tabSelectImg"></image>
          </picker>
        </view>
        <button class="login-button" @tap="login()">登 录</button>
        <view class="login-serve-address" @click="isShowLogin = false"
          >服务器地址
          <u-icon style="display: inline-block" name="arrow-right" color="#0062FF"></u-icon>
        </view>
      </view>
      <view v-if="!isShowLogin">
        <view class="login-form-item login-form-address">
          <input name="address" autocomplete="on" placeholder="请输入服务器地址" v-model="serveAddress" />
        </view>
        <button class="login-button" @tap="saveAddress(serveAddress)">保 存</button>
      </view>
    </form>
  </view>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import api from '@/common/api/'
  export default {
    data() {
      return {
        title: '登录账号',
        username: '', //用户名
        password: '', //密码
        hospitals: [],
        hospitalNames: [],
        hospital: '',
        hospitalTypeIndex: 0,
        hospitalArrayType: '请选择',
        tabSelectImg: '../../static/select_down.png',
        isShowLogin: true,
        serveAddress: 'http://'
      }
    },
    computed: {
      ...mapState('user', ['baseUrl'])
    },
    watch: {
      // 切换病区
      hospitalTypeIndex(val) {
        this.hospitalArrayType = this.hospitals[val]
        this.hospital = this.hospitalArrayType.hosname
        this.tabSelectImg = '../../static/select_down.png'
      },
      isShowLogin(val) {
        val ? (this.title = '登陆账号') : (this.title = '服务器地址')
      }
    },
    mounted() {
      if (this.baseUrl) {
        this.getList(this.baseUrl)
        this.serveAddress = this.baseUrl
      }
    },
    methods: {
      ...mapActions({
        setUserInfo: 'user/setUserInfo',
        setBaseUrl: 'user/setBaseUrl',
        removeBaseUrl: 'user/removeBaseUrl'
      }),
      /**
       * @description: 获取列表
       */
      getList(url) {
        api
          .getList({
            baseUrl: url
          })
          .then(
            res => {
              this.hospitalNames = []
              if (res.data.code === '200' && res.data.data.length) {
                this.hospitals = res.data.data
                this.hospitals.map(o => {
                  this.hospitalNames.push(o.hosname)
                })
              } else {
                uni.showToast({
                  title: `${res.data.msg}`,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            err => {
              console.log(err)
              uni.showToast({
                title: '未获取列表',
                icon: 'none',
                duration: 2000
              })
            }
          )
      },
      /**
       * @description: 点击登陆
       * @param usercode 用户名
       * @param password 密码
       * @return {*}
       */
      login() {
        if (!this.username) {
          uni.showToast({
            title: '请输入用户名',
            icon: 'none'
          })
          return
        }
        if (!this.password) {
          uni.showToast({
            title: '请输入密码',
            icon: 'none'
          })
          return
        }
        // console.log(this.baseUrl, this.serveAddress)
        if (!this.serveAddress) {
          uni.showToast({
            title: '请设置服务器地址',
            icon: 'none'
          })
          return
        }
        uni.showLoading({
          title: '加载中',
          mask: true
        })
        const baseParams = {
          usercode: this.username,
          password: this.password
        }
        api
          .login({
            baseUrl: this.serveAddress,
            data: baseParams
          })
          .then(
            res => {
              if (res.data.code === '200' && res.data.data) {
                this.setUserInfo(res.data.data)
                uni.showToast({
                  title: '登录成功！',
                  duration: 2000
                })
                uni.hideLoading()
                uni.redirectTo({
                  url: '/pages/ip-info-main/ip-info-main'
                })
                // this.$Router.push({ name: 'main' })
              } else {
                uni.showToast({
                  title: `${res.data.msg}`,
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            err => {
              uni.showToast({
                title: `${err}`,
                icon: 'none',
                duration: 2000
              })
            }
          )
      },
      /**
       * @description: 点击保存服务器地址到缓存
       */
      saveAddress(url) {
        if (!url) {
          uni.showToast({
            title: '请输入服务器地址',
            icon: 'none'
          })
          return
        }
        // 移除缓存中的服务器地址、重新设置缓存服务器的地址
        // this.removeBaseUrl();
        this.setBaseUrl(url)
        uni.showToast({
          title: '保存成功！',
          duration: 2000
        })
        this.getList(url)
        this.isShowLogin = true
      },
      onCancelHospital() {
        this.tabSelectImg = '../../static/select_down.png'
      },
      onClickHospital() {
        this.tabSelectImg = '../../static/select_up.png'
      },
      /**
       * 选择院区
       */
      onChangeHospital(e) {
        this.hospitalTypeIndex = e.target.value
      }
    }
  }
</script>
<style lang="scss">
  .login-wrap uni-input {
    padding-left: 50rpx !important;
  }

  .login-wrap {
    width: 100%;
    height: 100%;
    font-size: 28rpx;
    color: #000;
    position: relative;
    background: #fff;

    button {
      font-size: 14rpx;
      background: #258c60;
      color: #fff;
      width: 85%;
      height: 35rpx;
      line-height: 35rpx;
      border-radius: 5rpx;
      box-shadow: 0 5rpx 7rpx 0 rgba(86, 119, 252, 0.2);
      margin-top: 20rpx;
    }

    input {
      padding: 0 0 0 120rpx;
      height: 100%;
      line-height: 35rpx;
      background: #f8f7fc;
      border: 1rpx solid #e9e9e9;
      border-radius: 5rpx;
      margin-top: 20rpx;
      color: #818a9f;
      font-weight: normal;
      font-size: $uni-font-size-base;
    }

    .uni-input-placeholder {
      color: #818a9f;
      font-weight: normal;
    }

    .login-bg {
      // 右侧背景图片
      position: absolute;
      width: 37%;
      height: 100%;
      top: 0rpx;
      right: 0rpx;
      background: #fff;
    }

    .company-logo {
      // 公司logo
      width: 134rpx;
      height: 29rpx;
      // transform: scale(0.6);
      position: absolute;
      top: 20rpx;
      left: 30rpx;
    }
  }

  .login-describe-wrap {
    position: absolute;
    width: 290rpx;
    height: 305rpx;
    top: 140rpx;
    left: 12rpx;

    .login-bg1 {
      // 左下角背景图片
      position: absolute;
      width: 100%;
      height: 100%;
    }

    // 左下角文字描述
    .login-describe {
      position: absolute;
      width: 190rpx;
      height: 125rpx;
      top: 20rpx;
      left: 30rpx;
      font-size: 16rpx;
      font-family: 'YouSheBiaoTiHei';
      margin: 0 auto;

      .login-describe-text {
        margin-top: 15rpx;
      }
    }
  }

  // 登陆框
  .login-wrap .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(8%, -52%);
    width: 240rpx;
    height: 250rpx;
    background: #fff;
    box-shadow: 0rpx 0rpx 30rpx 1rpx rgba(0, 0, 0, 0.1);
    border-radius: 6rpx;
    opacity: 1;
    text-align: left;
    font-weight: bold;
    color: #898d99;
    padding-bottom: 40rpx;

    .login-title {
      text-align: center;
      margin-top: 20rpx;
      color: #258c60;
      font-size: 16rpx;
      font-weight: 500;

      .login-title-back {
        position: absolute;
        left: 20rpx;
      }
    }

    .login-form-item {
      width: 85%;
      height: 35rpx;
      line-height: 35rpx;
      position: relative;
      margin: 0 auto;

      .item-left-img {
        width: 14rpx;
        height: 14rpx;
        position: absolute;
        left: 20rpx;
        top: 12rpx;
        // border-right: 2rpx solid #dedede;
        padding-right: 8rpx;
      }

      .select-img {
        width: 8rpx;
        height: 6rpx;
        position: absolute;
        right: -10rpx !important;
        top: 16rpx;
        padding-right: 20rpx;
      }
    }

    .login-serve-address {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 10rpx;
      right: 5rpx;
      font-size: 12rpx;
      color: #0062ff;
    }
  }

  .login-form-address input {
    padding-left: 10rpx !important;
  }
</style>
