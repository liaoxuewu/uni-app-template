<template>
  <view class="uni-picker-container" @click="onClickPicker">
    <picker @change="onChangePicker" @cancel="onCancelPicker" :range="rangeData">
      <input :disabled="isDisabled" name="areaData" maxlength="20" :placeholder="placeholderText" v-model="inputData" />
      <image class="select-img" :src="selectImgSrc"></image>
    </picker>
  </view>
</template>

<script>
  export default {
    name: 'uni-custom-picker',
    props: {
      rangeData: {
        // 选择的数组数据
        type: Array,
        default: () => []
      },
      inputData: {
        // 选中的数据
        type: String,
        default: () => ''
      },
      placeholderText: {
        type: String,
        default: () => '请选择'
      },
      isDisabled: {
        type: Boolean,
        default: () => true
      },
      selectImgSrc: {
        type: String,
        default: () => ''
      }
    },
    watch: {},
    methods: {
      onClickPicker() {
        this.$emit('onClickPicker')
      },
      onChangePicker(e) {
        // console.log(e.target.value)
        this.$emit('onChangePicker', e.target.value)
      },
      onCancelPicker() {
        this.$emit('onCancelPicker')
      }
    }
  }
</script>

<style scoped lang="scss">
  .uni-picker-container {
    display: flex;
    width: 100rpx;
    margin: 5rpx auto;
    border-radius: 5rpx;
    margin-right: 10rpx;
    position: relative;

    input {
      height: 22rpx;
      line-height: 22rpx;
      background: #f8f7fc;
      border: 1rpx solid #e9e9e9;
      border-radius: 30rpx;
      color: #898d99;
      font-size: $uni-font-size-base-rpx;
      padding: 0 8rpx;
      text-align: left;
    }

    .select-img {
      width: 8rpx;
      height: 6rpx;
      position: absolute;
      right: 8rpx;
      top: 10rpx;
    }
  }
</style>
