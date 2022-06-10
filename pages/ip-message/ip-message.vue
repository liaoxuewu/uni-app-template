<template>
  <view class="message-wrap">
    <left-window></left-window>
    <view class="uni-content-right" :style="{ width: rightWidth + 'px' }">
      <view class="message-title">
        <text class="iconfont icon-pinglun"></text>
        消息
      </view>
      <view class="message-content"></view>
    </view>
  </view>
</template>

<script>
  import leftWindow from '@/windows/left-window.vue'
  export default {
    components: {
      leftWindow
    },
    data() {
      return {
        rightWidth: 0
      }
    },
    async onLoad() {
      const res = await uni.getSystemInfo()
      this.rightWidth = res[1].windowWidth - 100
    },
    methods: {}
  }
</script>

<style lang="scss">
  .message-wrap {
    height: 100%;
    background: #f2f2f2;
  }

  .message-title {
    width: 100%;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    background: #fff;
  }

  .message-content {
    background: #f2f2f2;
  }
</style>
