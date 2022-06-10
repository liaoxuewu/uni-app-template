<template>
  <view class="uni-empty-container">
    <image src="@/static/empty.png"></image>
    <view>暂无内容...</view>
  </view>
</template>

<script>
  export default {
    name: 'uni-empty'
  }
</script>

<style scoped lang="scss">
  .uni-empty-container {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 20rpx;
    color: #818a9f;

    image {
      width: 300rpx;
      heght: 180rpx;
    }
  }
</style>
