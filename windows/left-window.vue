<template>
  <scroll-view class="sidebar" scroll-y>
    <view class="left-window-user">
      <u-avatar class="user-avatar" :size="25" src="../../static/user_avatar.png"></u-avatar>
      <!--			<image class="user-avatar" src="@/static/user_avatar.png"></image>-->
      <view class="left-window-user-item">{{ userInfo.doctname }}</view>
      <view class="left-window-user-item">{{ userInfo.doctcode }}</view>
      <view class="left-window-user-line"></view>
    </view>
    <view class="left-menu-wrap">
      <scroll-view class="" scroll-y>
        <view
          class="menu-list-nav"
          @click="select(item, index)"
          :key="item.menu_id"
          v-for="(item, index) in staticMenu"
        >
          <text
            class="menu-list-icon"
            :style="current === index ? isActive : {}"
            :class="item.menu_id === categoryActive ? 'is-active ' + item.icon : '' + item.icon"
          ></text>
          <view class="menu-list-text">{{ item.text }}</view>
        </view>
      </scroll-view>
    </view>
    <!-- <router-link to="{name: home, params: {name: 'router-link'}}">
			<button type="primary">使用name对象跳转</button>
		</router-link>
		<router-link to="{name: system, params: {name: 'router-link'}}">
			<button type="primary">使用name对象跳转2</button>
		</router-link> -->
  </scroll-view>
</template>

<script>
  import { mapState } from 'vuex'
  import config from '@/config.js'
  export default {
    props: {
      isShowModule: String
    },
    data() {
      return {
        ...config.sideBar,
        avatarSrc: '',
        categoryActive: 'home',
        // userInfo: {},
        current: 0,
        isActive: {
          backgroundColor: 'rgba(#fff, 1)',
          color: '#258c60'
        }
      }
    },
    computed: {
      ...mapState('user', ['userInfo']),
      currentMenu() {
        return this.splitFullPath(this.active)
      }
    },
    methods: {
      select(e, i) {
        if (this.current != i) {
          this.current = i
        }
        // console.log(e)
        // TODO 后续调整
        let url = e.url

        if (!url) {
          url = this.active
        }
        this.categoryActive = e.menu_id
        this.$emit('update:isShowModule', e.menu_id)
        this.$bus.$emit('isShowHome', true)
      }
    }
  }
</script>

<style lang="scss">
  .sidebar {
    position: fixed;
    // top: var(--top-window-height); // useless
    width: $left-window-width;
    height: 100%;
    box-sizing: border-box;
    border-right: 1px solid darken($left-window-bg-color, 8%);
    background-color: $left-window-bg-color;
    padding-bottom: 10px;
  }

  .title {
    margin-left: 5px;
  }

  .left-window-user {
    width: 100%;
    text-align: center;
    color: #fff;
    padding-top: 10rpx;
    font-size: $uni-font-size-sm-rpx;

    .user-avatar {
      margin: 0 auto;
    }

    .left-window-user-item {
      margin-top: 8rpx;
    }

    .left-window-user-line {
      display: inline-block;
      width: 80%;
      height: 1px;
      background: #fff;
    }
  }

  .left-menu-wrap {
    text-align: center;

    .menu-list-nav {
      height: 60rpx;
      margin-top: 15rpx;

      .is-active {
        background-color: rgba(#fff, 1) !important;
        color: #258c60 !important;
      }

      .menu-list-icon {
        font-size: 18rpx;
        display: inline-block;
        padding: 5rpx;
        background: rgba(#fff, 0.1);
        border-radius: 5rpx;
        color: #fff;
      }

      .menu-list-text {
        color: #fff;
        opacity: 0.8;
        margin-top: 5rpx;
        font-size: $uni-font-size-lg-rpx;
      }
    }
  }
</style>
