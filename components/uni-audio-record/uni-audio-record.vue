<template>
  <view class="uni-record-container">
    <view class="uni-record-top">
      <text class="uni-record-top-title">录音</text>
      <text style="float: right" @click="closeRecord">关闭</text>
    </view>
    <view class="uni-record-count">
      <text class="uni-record-count-content">
        {{ hour < 10 ? `0${hour}` : hour }} : {{ minute < 10 ? `0${minute}` : minute }} : {{ second < 10 ? `0${second}` : second }}
        {{ count }}
      </text>
    </view>
    <view class="uni-record-operate">
      <view>
        <text class="iconfont icon-zhongzhi"></text>
        <view>重制</view>
      </view>
      <text @click="recordToggle" :class="isRecording ? 'icon-luyinzhong' : 'icon-luyinzanting-1' " class="uni-record-operate-start iconfont"></text>
      <view>
        <text class="iconfont icon-wancheng"></text>
        <view @click="recordConfirm">完成</view>
      </view>
      <view @click="playBtn()">播放</view>
    </view>
  </view>
</template>
<script>
const RECORD_MANAGER = uni.getRecorderManager()
const INNER_AUDIO_CONTEXT = uni.createInnerAudioContext()
let init // 录制时长计时器
let timer // 播放录制倒计时
export default {
  data() {
    return {
      count: null, // 录制倒计时
      longPress: '1', // 1显示 按住说话 2显示 说话中
      delShow: false, // 删除提示框显示隐藏
      time: 0, // 录音时长
      hour: 0,
      minute: 0,
      second: 0,
      duration: 120000, // 录音最大值ms 60000/1分钟
      tempFilePath: '', // 音频路径
      playStatus: 0, // 录音播放状态 0:未播放 1:正在播放
      isRecording: false, // 录音状态 true:录制中 false:录制停止
    }
  },
  watch: {
    isRecording(val) {
      console.log(val)
      val ? this.startRecord() : this.endRecord()
    }
  },
  methods: {
    recordToggle() {
      this.isRecording = !this.isRecording
    },
    startRecord() {
      this.longPress = '2'
      this.countdown(60) // 倒计时
      clearInterval(init) // 清除定时器
      RECORD_MANAGER.onStop(res => {
        this.tempFilePath = res.tempFilePath
        this.recordingTimer(this.time)
      })
      const options = {
        duration: this.duration, // 指定录音的时长，单位 ms
        sampleRate: 16000, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 96000, // 编码码率
        format: 'mp3', // 音频格式，有效值 aac/mp3
        frameSize: 10 // 指定帧大小，单位 KB
      }
      this.recordingTimer()
      RECORD_MANAGER.start(options)
      // 监听音频开始事件
      RECORD_MANAGER.onStart(res => {
        console.log(res)
      })
    },
    endRecord() {
      this.longPress = '1'
      RECORD_MANAGER.onStop(res => {
        this.tempFilePath = res.tempFilePath
        this.$emit('modalConfirm', res.tempFilePath)
      })
      this.recordingTimer(this.time)
      RECORD_MANAGER.stop()
    },
    recordConfirm() {
      this.$emit('recordConfirm')
      this.closeRecord()
    },
    /**
     * 倒计时
     */
    countdown(val) {
      this.count = Number(val)
      timer = setInterval(() => {
        if (this.count > 0) {
          this.count--
        } else {
          this.longPress = '1'
          clearInterval(timer)
        }
      }, 1000)
    },
    recordingTimer(time) {
      if (time == undefined) {
        // 将计时器赋值给init
        init = setInterval(() => {
          this.time++
          this.second++;
          if (this.second >= 60) {
            this.second = 0;
            this.minute = this.minute + 1;
          }
          console.log(this.second)
          if (this.minute >= 60){
            this.minute = 0;
            this.hour = this.hour + 1;
          }
        }, 1000)
      } else {
        clearInterval(init)
      }
    },
    /**
     * 删除
     */
    delBtn() {
      this.delShow = false
      this.time = 0
      this.tempFilePath = ''
      this.playStatus = 0
      INNER_AUDIO_CONTEXT.stop()
    },
    /**
     * 播放
     */
    playBtn() {
      INNER_AUDIO_CONTEXT.src = this.tempFilePath
      // 在ios下静音时播放没有声音，默认为true，改为false就好了。
      // innerAudioContext.obeyMuteSwitch = false
      // 点击播放
      if (this.playStatus == 0) {
        this.playStatus = 1
        INNER_AUDIO_CONTEXT.play()
        this.countdown(this.time) // 倒计时
      } else {
        this.playStatus = 0
        INNER_AUDIO_CONTEXT.pause()
      }
      // 播放结束
      INNER_AUDIO_CONTEXT.onEnded(() => {
        this.playStatus = 0
        INNER_AUDIO_CONTEXT.stop()
      })
    },
    closeRecord() {
      this.$emit('update:isShowRecord', false)
      this.$emit('update:isShowMask', false)
    }
  }
}
</script>

<style scoped lang="scss">
.uni-record-container {
  position: fixed;
  top: 0;
  bottom: 120rpx;
  left: 0;
  width: 100%;
  border: 1rpx solid #C4C6CB;
  border-radius: 6rpx;

  .uni-record-top {
    width: 100%;
    height: 25rpx;
    line-height: 25rpx;
    text-align: center;
    background: #F3F4FA;

    .uni-record-top-title {
      color: #262727;
      font-weight: 100;
    }

  }

  .uni-record-count {
    font-size: 35rpx;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .uni-record-operate {
    display: flex;
    justify-content: space-around;

    .uni-record-operate-start {
      color: red;
      font-size: 30rpx;
    }
  }
}
</style>