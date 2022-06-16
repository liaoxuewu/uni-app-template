<template>
  <view class="uni-content-right">
    <view class="system-title">
      <text class="iconfont icon-shezhi_2" style="vertical-align: bottom"></text>
      <text>设置</text>
    </view>
    <view class="system-content">
      <view class="system-content-left" @click="onClickItem">
        <view id="system" :style="current === 'system' ? activeColor : {}" class="system-content-left-item">
          <text
            :style="current === 'system' ? activeColorIcon : {}"
            class="left-item-icon-system iconfont icon-shezhi_2"
          ></text>
          系统
        </view>
        <!--				<view id="data" :style="current === 'data' ? activeColor2 : {}" class="system-content-left-item">-->
        <!--					<text :style="current === 'data' ? activeColorIcon2 : {}"-->
        <!--						class="left-item-icon-data iconfont icon-shuju_2"></text>-->
        <!--					数据/缓存-->
        <!--				</view>-->
        <view class="system-exit" @click="exitSystem">退出</view>
      </view>
      <view class="system-content-right">
        <view class="system-content-right-system" v-if="current === 'system'">
          <view class="system-content-right-item">
            <image class="company-logo" src="@/static/company_logo.png"></image>
          </view>
          <view style="font-size: 14rpx" class="system-content-right-item">
            <text style="color: #898d99">系统版本：</text>{{ versionName }}</view
          >
          <view style="color: red" class="system-content-right-item">当前已经是最新版本</view>
        </view>
        <view v-if="current === 'data'">
          <view class="system-content-right-item1">信息缓存版本</view>
          <view class="system-content-right-item1">系统日志</view>
          <view class="system-content-right-item1 order-detail-top-content order-detail-status">
            <view
              @click="onClickItemStatus(index)"
              class="order-detail-top-item"
              :style="current1 === index ? activeColor : {}"
              v-for="(item, index) in orderStatus"
              :key="index"
            >
              {{ item }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        current: 'system',
        versionName: '1.0.1',
        rightWidth: 0,
        activeColor: {
          background: '#FDEEEE'
        },
        activeColorIcon: {
          color: '#fff',
          background: '#FA5151'
        },
        activeColor2: {
          background: '#E5EFFF'
        },
        activeColorIcon2: {
          color: '#fff',
          background: '#0062FF'
        },
        current1: 0,
        orderStatus: ['全部', '异常', '普通']
      }
    },
    computed: {
      ...mapState('app', ['systemInfo'])
    },
    async mounted() {
      this.rightWidth = this.systemInfo - 100
      // #ifdef APP-PLUS
      this.getSysProperty()
      // #endif
    },
    methods: {
      ...mapActions({
        removeUserInfo: 'user/removeUserInfo',
        removeBaseUrl: 'user/removeBaseUrl'
      }),
      /**
       *  获取系统属性
       */
      getSysProperty() {
        // #ifdef APP-PLUS
        plus.runtime.getProperty(plus.runtime.appid, info => {
          let obj = {
            appid: info.appid,
            version: info.version,
            name: info.name,
            description: info.description,
            author: info.author,
            email: info.email,
            features: info.features
          }
          this.versionName = obj.version
        })
        // #endif
      },
      onClickItem(e) {
        console.log(e.target.id)
        this.current = e.target.id
        if (this.current === 'system') {
          this.activeColor = {
            background: '#FDEEEE'
          }
          this.activeColorIcon = {
            color: '#fff',
            background: '#FA5151'
          }
          this.activeColor2 = {}
          this.activeColorIcon2 = {}
        } else if (this.current === 'data') {
          this.activeColor = {}
          this.activeColorIcon = {}
          this.activeColor2 = {
            background: '#E5EFFF'
          }
          this.activeColorIcon2 = {
            color: '#fff',
            background: '#0062FF'
          }
        }
      },
      exitSystem() {
        this.removeUserInfo()
        // this.removeBaseUrl();
        uni.redirectTo({
          url: '/pages/login/login'
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  $uni-system-color: #d7d8de;

  uni-page-body {
    height: 100%;
    background: #fff;
  }

  .uni-content-right {
    position: fixed;
  }

  .system-title {
    width: 100%;
    color: #262727;
    text-align: center;
    background-color: #fff;
    height: 20rpx;
    line-height: 20rpx;
    font-size: $uni-font-size-base-rpx;
  }

  .system-content {
    height: 100%;
    background: #f2f2f2;
    margin-top: 2rpx;
    display: flex;

    .system-content-left {
      width: 35%;
      height: 100%;
      background: #fff;
      border-right: 1rpx solid $uni-system-color;

      .system-content-left-item {
        height: 50rpx;
        line-height: 50rpx;
        border: 1rpx solid $uni-system-color;
        margin: 10rpx;
        border-radius: 5rpx;

        .left-item-icon-system {
          width: 10rpx;
          height: 10rpx;
          background: #fdeeee;
          color: #fa5151;
          border-radius: 10rpx;
          padding: 3rpx;
          margin: 0 10rpx 0 10rpx;
        }

        .left-item-icon-data {
          width: 10rpx;
          height: 10rpx;
          background: #e5efff;
          color: #0844ff;
          border-radius: 10rpx;
          padding: 3rpx;
          margin: 0 10rpx 0 10rpx;
        }
      }

      .system-exit {
        position: absolute;
        bottom: 30rpx;
        width: 210rpx;
        height: 40rpx;
        line-height: 40rpx;
        border: 1rpx solid $uni-system-color;
        margin: 10rpx;
        border-radius: 5rpx;
        background: #fdeeee;
        text-align: center;
        color: #fa5151;
      }

      .system-exit1 {
        position: absolute;
        bottom: 100rpx;
        width: 210rpx;
        height: 40rpx;
        line-height: 40rpx;
        border: 1rpx solid $uni-system-color;
        margin: 10rpx;
        border-radius: 5rpx;
        background: #258c60;
        text-align: center;
        color: #fff;
      }

      .system-exit2 {
        position: absolute;
        bottom: 200rpx;
        width: 210rpx;
        height: 40rpx;
        line-height: 40rpx;
        border: 1rpx solid $uni-system-color;
        margin: 10rpx;
        border-radius: 5rpx;
        background: #258c60;
        text-align: center;
        color: #fff;
      }
    }

    .system-content-right {
      width: 65%;
      height: 100%;
      background: #fff;

      .system-content-right-system {
        text-align: center;

        .company-logo {
          width: 480px;
          height: 100px;
          transform: scale(0.5);
          margin: 20rpx 0 0 30rpx;
        }

        .system-content-right-item {
          margin-top: 10rpx;
        }

        .order-detail-top-content {
          width: 200rpx;
          height: 100%;
          border: 1rpx solid #edeff3;
          display: flex;
          justify-content: space-around;
          border-radius: 5rpx;
        }

        .system-content-right-item1 {
          margin: 10rpx 0 10rpx 10rpx;
        }
      }
    }
  }
</style>
