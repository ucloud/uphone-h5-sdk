<template>
  <div
    class="videoloading"
    v-loading="loading"
    :element-loading-text="loadingtext"
    element-loading-spinner="el-icon-loading"
    element-loading-background="transparent"
  >
    <el-result
      v-if="isresult"
      icon="warning"
      :title="loadingtext"
      subTitle="是否强制连接"
    >
      <template slot="extra">
        <el-button
          class="el-button-style"
          @click.stop="forceconnect"
          type="primary"
          size="mini"
          >确定</el-button
        >
      </template>
    </el-result>
    <el-result
      v-if="isduplicate"
      icon="warning"
      :title="duplicatetext"
      subTitle="该设备正在其他网页尝试连接"
    >
    </el-result>
    <i v-if="icestatus == 'connected'" class="el-icon-success status"></i>
    <i
      v-if="icestatus == 'disconnected'"
      class="el-icon-warning warning-status"
    >
    </i>
    <video
      id="video"
      ref="revideo"
      :poster="poster"
      muted
      autoplay
      playsinline
      webkit-playsinline
    ></video>
  </div>
</template>
 
<script>
import { getstream, getrtc } from "../utils/groupconnection";
export default {
  props: {
    id: String,
    show: Boolean,
  },
  data() {
    return {
      loading: true,
      loadingtext: "正在启动",
      icestatus: "disconnected",
      remotestream: "",
      poster: require("../assets/bg.jpeg"),
      isresult: false,
      isduplicate: false,
      duplicatetext: "连接断开",
    };
  },
  computed: {
    getrtclist() {
      return this.$store.state.rtclist;
    },
  },
  watch: {
    remotestream(newVal, oldVal) {
      if (newVal) {
        this.$refs.revideo.srcObject = newVal;
      }
    },
    getrtclist: {
      handler(newVal, oldVal) {
        // console.log(newVal)
        // console.log(oldVal);
        const data = JSON.parse(JSON.stringify(newVal));
        // console.log("itemrtclist");
        // console.log(newVal);
        if (data.length == 0) {
          this.icestatus = "disconnected";
          this.loading = false;
          this.isresult = false;
          this.isduplicate = false;
        }
        try {
          data.forEach((item, index) => {
            if (item.phoneId == this.id) {
              this.loadingtext = item.icestatustext;
              if (item.icestatus == 136) {
                this.isduplicate = true;
                this.loading = false;
                this.icestatus = "disconnected";
                throw new error();
              }
              if (item.icestatus == 500) {
                this.isresult = false;
                // this.remotestream = getstream(this.id);
                throw new error();
              }
              if (item.icestatus == "connected") {
                this.remotestream = getstream(this.id);
                this.icestatus = "connected";
                this.loading = false;
              } else {
                this.remotestream = getstream(this.id);
                this.icestatus = "disconnected";
                this.loading = item.isresult ? false : true;
                this.isresult = item.isresult;
              }
            } else {
            }
          });
        } catch (error) {
          return;
        }
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    forceconnect() {
      var rtc = getrtc(this.id);
      rtc.forceconnent();
      console.log("force");
    },
    clearstatus() {
      this.isresult = false;
      this.isduplicate = false;
      this.loading = false;
      this.icestatus = "disconnected";
    },
  },
  created() {},
  mounted() {
    var data = this.$store.state.rtclist;
    data.forEach((item, index) => {
      if (item.phoneId == this.id) {
        if (item.isresult) {
          this.isresult = true;
          this.loading = false;
          this.icestatus = "disconnected";
          this.loadingtext = item.icestatustext;
          console.log(item.icestatus);
        }
        if (item.icestatus == 136) {
          this.isduplicate = true;
          this.loading = false;
          this.icestatus = "disconnected";
        }
      }
    });
  },
  beforeDestroy() {
    this.remotestream = "";
  },
};
</script>

<style lang="scss">
.videoloading {
  width: 100%;
  height: 100%;
  position: relative;
  // background: #000;
  .el-result {
    z-index: 100;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .el-button-style {
    font-size: 12px;
    color: #fff;
    box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
      rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
      rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
    background: linear-gradient(
      135deg,
      rgb(100, 136, 252) 0%,
      rgb(56, 96, 244) 100%
    );
  }
  .el-result__title p {
    color: #768de2;
  }
}
#video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
.status {
  font-size: 25px;
  color: #67c23a;
  position: absolute;
  top: -15px;
  right: -15px;
}
.warning-status {
  font-size: 25px;
  color: #e6a23c;
  position: absolute;
  top: -15px;
  right: -15px;
}
</style>