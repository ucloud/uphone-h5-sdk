<template></template>
<script>
import ucloudrtcController from "../sdk/controller";
export default {
  props: ["id", "query"],
  data() {
    return {
      rtc: null,
      loading: false,
      loadingtext: "加载中,请稍候",
      loadingicon: "",
    };
  },
  mounted() {
    // this.$refs.revideo.src = this.url;
    this.$bus.$on("sendgruopmsg", (res) => {
      this.sendmsg(res);
    });
    this.$bus.$on("allrestart", (res) => {
      this.restart();
    });
    this.$bus.$on("hangup", () => {
      this.hangup();
    });
    this.$bus.$on("startconnection", () => {
      this.startconnection();
    });
    var _this = this;
    var loadingParams = {
      Id: this.id, // navigation params roomid
      mediaConstraints: {
        audio: true,
        video: true,
      },
    };
    //建立webrtc连接;
    this.creatertcserve(loadingParams, _this);
    this.startconnection();
  },
  beforeDestroy() {
    this.hangup();
  },
  methods: {
    // ----连接游戏三步骤----

    // Step 1 初始化实例
    creatertcserve(loadingParams) {
      this.rtc = new ucloudrtcController(loadingParams);
    },
    // Step 2 启动云游戏并建立信令服务器连接
    startconnection() {
      this.rtc.startConnection();
      //云游戏连接状态变更回调
      this.rtc.onstatus("connectstatus", (states) => {
        if (states == 100) {
          //   this.loadingtext = "请重新启动";
          //   this.loadingicon = "el-icon-refresh-left";
          this.restart();
        }
        if (states == 1001) {
          this.$message.error("创建连接点失败，请重试!");
          this.restart();
        }
        if (states == 1003) {
          //   this.$message.error("创建用户控制类失败");
          this.restart();
        }
        if (states == 1008) {
          this.$message.error("创建媒体应答失败，请重试!");
          this.restart();
        }
        if (states == 1026) {
          this.$message.error("此连接已被占用，请更换云游戏id!");
        }
        if (states == 1027) {
          this.$message.error("生成offer超时!");
          this.loading = false;
        }
        if (states == 1028) {
          this.$message.error("生成candidate超时!");
          this.loading = false;
        }
        if (states == 73002) {
          this.$message.error("云游戏实例ID不存在!" + this.id);
          this.loading = false;
        }
        if (states == 90012) {
          this.$message.error("未找到answer!" + this.id);
          this.loading = false;
        }
      });
      //p2p连接状态变更回调
      this.rtc.onstatus("icestatus", (states) => {
        if (states == "connected") {
          //p2p连接成功，才可获取远程媒体流
          this.$message.success("连接成功" + this.id);
          this.loading = false;
        }
        if (states == "disconnected") {
          // this.$message.error("数据连接断开,请离开重新连接");
          this.restart();
        }
      });
    },
    //信息交互(发送消息到服务器)
    sendmsg(message) {
      if (this.rtc !== null) {
        this.rtc.sendMessage(message);
      }
    },
    hangup() {
      this.rtc.closeConnection();
      this.rtc = null;
    },
    //重新连接
    restart() {
      this.loading = true;
      this.rtc.reStart();
    },
    //关闭弹窗重新连接
    restartnew() {
      var _this = this;
      var loadingParams = {
        Id: this.id, // navigation params roomid
        mediaConstraints: {
          audio: true,
          video: true,
        },
      };
      //建立webrtc连接;
      this.creatertcserve(loadingParams, _this);
      this.startconnection();
    },
  },
};
</script>

<style>
</style>
