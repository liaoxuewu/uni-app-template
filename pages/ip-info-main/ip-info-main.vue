<template>
  <view>
    <!--  #ifdef APP-PLUS -->
    <view class="status_bar"></view>
    <!--  #endif -->
    <left-window :isShowModule.sync="isShowModule"></left-window>
    <view :style="{ height: windowHeight + 'px' }" class="uni-main-wrap">
      <ip-info-home ref="home" v-if="isShowModule === 'home'"></ip-info-home>
      <ip-info-note v-if="isShowModule === 'note'"></ip-info-note>
      <ip-system v-if="isShowModule === 'system'"></ip-system>
    </view>
  </view>
</template>

<script>
  import leftWindow from '@/windows/left-window.vue'
  import ipInfoHome from './components/ip-info-home.vue'
  import ipInfoNote from '../ip-info-note/ip-info-note.vue'
  import ipSystem from '../ip-system/ip-system.vue'
  export default {
    components: {
      leftWindow,
      ipInfoHome,
      ipInfoNote,
      ipSystem
    },
    data() {
      return {
        isShowModule: 'home',
        statusBarHeight: 0,
        windowHeight: 0
      }
    },
    async mounted() {
      this.windowHeight = uni.getSystemInfoSync().windowHeight
      console.log(this.windowHeight + '屏幕高度')
      // #ifdef APP-PLUS
      this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
      console.log(this.statusBarHeight + '状态栏高度')
      void plus.navigator.setStatusBarStyle('light') // 白色
      // 通过 id 获取 nvue 子窗体
      // const subNVue = uni.getSubNVueById('note-edit')
      // 关闭 nvue 子窗体
      // subNVue.hide('fade-out', 300)
      // #endif
    },
    // 监听下拉刷新
    onPullDownRefresh() {
      console.log('触发下拉刷新')
      setTimeout(() => {
        if (this.isShowModule === 'home') {
          this.$refs.home.init()
        } else if (this.isShowModule === 'note') {}
        // 关闭下拉刷新
        uni.stopPullDownRefresh()
      }, 1000)
    }
  }
</script>

<style lang="scss">
  .status_bar {
    position: fixed;
    top: 0;
    z-index: 100;
    height: var(--status-bar-height); // 这里是状态栏css变量
    background: #000;
    width: 100%;
  }

  .uni-main-wrap {
    height: 100%;
    display: flex;
    margin-top: var(--status-bar-height);
  }
</style>
