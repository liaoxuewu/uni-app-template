<!--
 * @Description: 患者个人信息
 * @Author liaoxuewu
 * @create 2022/4/12 11:13
 -->
<template>
  <view class="uni-person-info-wrap">
    <view class="uni-person-info-content uni-person-info-left">
      <view class="uni-person-info-left1">
        <u-avatar class="uni-person-info-avatar" :src="'../../static/' + personInfo.avatarName + '.png'"></u-avatar>
        <view>
          <view class="user-name">
            <text>{{ personInfo.patiname }}</text>
          </view>
          <view class="user-age">
            <text style="margin-right: 10rpx">{{ personInfo.age }}岁</text>
            <text :class="personInfo.genderIcon" class="iconfont" style="margin-right: 10rpx"></text>
          </view>
        </view>
      </view>
      <view class="uni-person-info-left2">
        <view class="uni-person-info-left2-top">
          <view class="uni-info-item">
            <view class="uni-info-item-content">
              <text class="user-info-icon user-icon-depart iconfont " :class="personInfo.deptIcon"></text>
              <text class="user-info-text">{{ personInfo.deptname }}</text>
            </view>
            <view class="uni-info-item-content">
              <text class="user-info-icon user-icon-hospital iconfont icon-yiyuan1"></text>
              <text class="user-info-text">No.{{ personInfo.patientno }}</text>
            </view>
            <view class="uni-info-item-content content-bed">
              <text class="user-info-icon user-icon-bed iconfont icon-danrenchuang"></text>
              <text class="user-info-text">{{ personInfo.bedNo }}</text>
            </view>
          </view>
          <view class="uni-info-item">
            <view class="uni-info-item-content">
              <text class="user-info-icon user-icon-tel iconfont icon-dianhua"></text>
              <text class="user-info-text">{{ personInfo.hometel }}</text>
            </view>
            <view class="uni-info-item-content content-address">
              <text class="user-info-icon user-icon-address iconfont icon-dingwei"></text>
              <text class="user-info-text">{{ personInfo.homeaddress }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="uni-person-info-content uni-person-info-right">
      <view class="">
        <view class="uni-person-info-right-title">预交金</view>
        <view class="uni-person-info-right-content right-content">{{ personInfo.prepaycost }}</view>
      </view>
      <view class="">
        <view class="uni-person-info-right-title">费用</view>
        <view class="uni-person-info-right-content right-content1">{{ personInfo.totcost }}</view>
      </view>
      <view class="">
        <view class="uni-person-info-right-title">余额</view>
        <view class="uni-person-info-right-content right-content2">{{ personInfo.freecost }}</view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'uni-person-info',
    props: {
      personInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss">
  .uni-person-info-wrap {
    height: 42rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background: linear-gradient(to right, #f3fcf8, #e0fff1, #f3fcf8);
    // background-color: #f3fcf8;
    .uni-person-info-avatar {
      transform: scale(0.6);
      margin-top: -5rpx;
      margin-right: $uni-spacing-row-sm-rpx;
    }
  }

  .uni-person-info-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 5rpx;
    font-size: 10rpx;
  }

  .uni-person-info-left {
    width: 65%;
    border-radius: 10rpx 0 0 10rpx;
    border-right: 1rpx dashed #84ccac;
    // margin-bottom: $uni-spacing-col-base-rpx;
  }

  // 左侧患者头像、姓名、年龄
  .uni-person-info-left1 {
    width: 30%;
    display: flex;
    flex-direction: row;
    margin-left: 10rpx;
    // justify-content: space-around;
    .user-name {
      font-weight: bold;
      color: #262727;
      font-size: 14rpx;
    }
    .user-age {
      font-size: $uni-font-size-base-rpx;
    }
  }

  .user-avatar {
    width: 30rpx;
    height: 30rpx;
  }

  .user-info-icon {
    vertical-align: bottom;
    width: 15rpx;
    height: 15rpx;
    line-height: 15rpx;
    border-radius: 15rpx;
    padding: 3rpx;
    font-size: 10rpx;
    text-align: center;
  }

  .user-icon-depart {
    color: #ffa000;
    background: rgba(255, 160, 0, 0.2);
  }

  .user-icon-hospital {
    color: #0062ff;
    background: rgba(0, 98, 255, 0.2);
  }

  .user-icon-bed {
    color: #fa5151;
    background: rgba(250, 81, 81, 0.2);
  }

  .user-icon-tel {
    color: #0062ff;
    background: rgba(0, 98, 255, 0.2);
  }

  .user-icon-address {
    color: #258c60;
    background: rgba(37, 140, 96, 0.2);
  }

  // 右侧科室、住院号、电话等
  .uni-person-info-left2 {
    width: 70%;
  }

  .uni-person-info-left2-top {
    display: flex;
    flex-direction: column;
  }

  .uni-info-item {
    display: flex;
    .uni-info-item-content {
      width: 100rpx !important;
      margin-bottom: 5rpx;
      // overflow: hidden; // 超出的文本隐藏
      // text-overflow: ellipsis; // 溢出用省略号显示
      white-space: nowrap; // 溢出不换行

      .user-info-text {
        margin-left: $uni-spacing-col-sm-rpx;
        // text-align: center;
      }
    }
    .content-bed {
      width: 60rpx !important;
    }

    .content-address {
      overflow: hidden; // 超出的文本隐藏
      text-overflow: ellipsis; // 溢出用省略号显示
      white-space: nowrap; // 溢出不换行
      width: 200rpx !important;
    }
  }

  .uni-person-info-right {
    width: 35%;
    border-radius: 0 10rpx 10rpx 0;
    text-align: center;
  }

  .uni-person-info-right-title {
    color: #898d99;
    margin-bottom: 4rpx;
  }

  .uni-person-info-right-content {
    font-weight: bold;
    font-size: 12rpx;
  }

  .right-content {
    color: #21bc5d;
  }

  .right-content1 {
    color: #0b5cff;
  }

  .right-content2 {
    color: #fc113f;
  }
</style>
