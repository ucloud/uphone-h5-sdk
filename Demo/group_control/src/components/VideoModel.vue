<template>
  <div>
    <el-dialog
      @opened="initvideo"
      :before-close="closemodel"
      :visible.sync="showmodel"
      :close-on-click-modal="false"
      :modal="false"
      v-dialogDrag
      ref="dialog"
      class="my-info-dialog"
    >
      <div style="-webkit-user-select: none" slot="title" class="dialog-title">
        <span>{{ data.phoneId }}</span>
        <span style="font-size: 12px; margin-left: 5px">{{ content }}</span>
      </div>
      <div ref="modelbody" class="modelbody">
        <div
          v-loading="loading"
          :element-loading-text="loadingtext"
          element-loading-spinner="el-icon-loading"
          element-loading-background="transparent"
          class="c-video"
          ref="cvideo"
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
                @click="forceconnect"
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
            <!-- <template slot="extra">
              <el-button @click="forceconnect" type="primary" size="mini"
                >确定</el-button
              >
            </template> -->
          </el-result>
          <i v-if="icestatus == 'connected'" class="el-icon-success status"></i>
          <i
            v-if="icestatus == 'disconnected'"
            class="el-icon-warning warning-status"
          ></i>
          <video
            id="remote-video"
            ref="revideo"
            autoplay
            playsinline
            webkit-playsinline
            @contextmenu.prevent
            @blur="blur"
            @mousedown="mousedown"
            @mouseup="mouseup"
            @mousemove="mousemove"
            @mouseout="mouseout"
            @mousewheel="mousewheel"
            style="width: 100%; height: 100%; pointer-events: pointer"
          ></video>
        </div>

        <div class="setting-area">
          <ul class="setting-ul">
            <!-- <li>
              <i class="el-icon-odometer"></i
              ><span>{{ currentRoundTripTime * 1000 }}ms</span>
            </li> -->
            <li @click="backhome">
              <i class="el-icon-monitor"></i><span>桌面</span>
            </li>
            <li @click="phonemenu">
              <i class="el-icon-odometer"></i><span>加速</span>
            </li>
            <li @click="backpage">
              <i class="el-icon-back"></i><span>返回</span>
            </li>
            <el-popconfirm @confirm="allrestart" title="确认重启吗?">
              <li slot="reference">
                <i class="el-icon-refresh"></i><span>重启</span>
              </li>
            </el-popconfirm>
            <li @click="changerotate">
              <i class="el-icon-sort"></i><span>旋转</span>
            </li>
            <li @click="showgpsmodel">
              <i class="el-icon-position"></i><span>GPS</span>
            </li>
            <el-popconfirm
              @confirm="newphone"
              title="一键新机会重启云手机,确定一键新机吗？"
            >
              <li slot="reference">
                <i class="el-icon-mobile"></i><span>新机</span>
              </li>
            </el-popconfirm>

            <li @click="addvolume">
              <i class="el-icon-circle-plus-outline"></i><span>音量+</span>
            </li>
            <li @click="devolume">
              <i class="el-icon-remove-outline"></i><span>音量-</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>

    <gps-model
      title="设置主控GPS"
      :showsetgps="showsetgps"
      :checkeditem="checkeditem"
      :query="query"
      @closegpsmodel="closegpsmodel"
    ></gps-model>
  </div>
</template>
<script>
import ucloudrtcController from "../sdk/groupcontroller";
import { sendmessage } from "../utils/groupconnection";
import transKeyCode from "../utils/transkeycode";
import GpsModel from "./GpsModel.vue";
export default {
  props: ["showmodel", "data", "query", "iftongbu", "list"],
  data() {
    return {
      // poster: require("../assets/bg.jpeg"),
      rtc: null,
      currentRoundTripTime: 0,
      loading: true,
      loadingtext: "连接中",
      duplicatetext: "连接已断开",
      icestatus: "disconnected",
      height: "",
      rotate: "portrait",
      ratio: "1.7777777777777777",
      showsetgps: false,
      checkeditem: [],
      count: 0,
      content: "正在建立连接...",
      timmer: null,
      isresult: false,
      isduplicate: false,
      kbdown: false,
    };
  },
  components: { GpsModel },
  mounted() {
    var _this = this;
    //全局监听键盘事件
    document.addEventListener("keydown", _this.onkeydown);
    document.addEventListener("keyup", _this.onkeyup);
  },
  beforeDestroy() {
    console.log("video model destroy.");
    this.rtc = null;
  },
  methods: {
    initvideo() {
      var _this = this;
      var loadingParams = {
        Id: this.data.phoneId,
        mediaConstraints: {
          audio: true,
          video: true,
        },
        debug: true,
      };
      //建立webrtc连接
      this.creatertcserve(loadingParams, _this);
      console.log("initvideo startconnection.");
      setTimeout(() => {
        this.startconnection();
        this.getcurrentround();
      }, 200);
    },
    // ----连接游戏三步骤----

    // Step 1 初始化实例
    creatertcserve(loadingParams, _this) {
      this.rtc = new ucloudrtcController(loadingParams, _this);
      this.rtc.setmaincontrol(true);
    },
    // Step 2 启动云游戏并建立信令服务器连接
    startconnection() {
      this.rtc.startConnection();
      //云游戏连接状态变更回调
      this.rtc.onstatus("devicestatus", (states) => {
        if (states == 500) {
          this.content = "强制连接中";
          this.isresult = false;
          this.restart();
        }
        if (states == 136) {
          this.content = "网络连接断开";
          this.icestatus = "disconnected";
          this.rtc.Hangup();
          this.isduplicate = true;
          return;
        }
        if (
          states == 1000 ||
          states == 1001 ||
          states == 1002 ||
          states == 1003 ||
          states == 1004 ||
          states == 1005 ||
          states == 1006 ||
          states == 1007 ||
          states == 1008 ||
          states == 1009 ||
          states == 1026 ||
          states == 1027 ||
          states == 1028 ||
          states == 1031 ||
          states == 73002 ||
          states == 90012 ||
          states == 1038
        ) {
          if (this.icestatus == "connected") {
            console.log("====主控连接成功====");
          } else {
            this.loading = true;
            this.icestatus = "disconnected";
            this.content = `状态${states}`;
            switch (states) {
              case 1001:
                this.loadingtext = "网络连接错误";
                break;
              case 1003:
                this.loadingtext = "设备错误";
                break;
              case 1008:
                this.loadingtext = "服务器未响应";
                break;
              case 1026:
                ++this.count;
                if (this.count == 4) {
                  this.loadingtext = "设备被占用";
                  this.isresult = true;
                  this.loading = false;
                  return;
                }
                break;
              case 1027:
                this.loadingtext = "网络连接错误";
                break;
              case 1028:
                this.loadingtext = "网络连接错误";
                break;
              case 1031:
                this.loadingtext = "网络连接错误";
                break;
              case 1038:
                break;
              case 73002:
                this.loadingtext = "设备不存在";
                break;
              case 42100:
                this.loadingtext = "请求参数错误";
                break;
              case 50000:
                this.loadingtext = "服务器内部错误";
                break;
              case 90010:
                this.loadingtext = "网络连接错误";
                break;
              case 90011:
                this.loadingtext = "网络连接错误";
                break;
              case 90012:
                this.loadingtext = "网络连接错误";
                break;
              case 90013:
                this.loadingtext = "网络连接错误";
                break;
              default:
                this.loadingtext = "网络连接错误";
                break;
            }
            this.restart();
          }
        }
      });
      //p2p连接状态变更回调
      this.rtc.onstatus("networkstatus", (states) => {
        switch (states) {
          case "connected":
            this.getremotestream();
            this.loading = false;
            this.icestatus = "connected";
            this.content = `连接完成`;
            break;
          case "new":
            this.content = `网络连接中`;
            this.icestatus = "disconnected";
            this.loadingtext = "网络连接中";
            break;
          case "checking":
            this.content = `网络连接中`;
            this.icestatus = "disconnected";
            this.loadingtext = "网络连接中";
            break;
          case "failed":
            this.content = `网络连接中`;
            this.icestatus = "disconnected";
            this.loadingtext = "网络连接中";
            this.loading = true;
            this.restart();
            break;
          case "disconnected":
            this.icestatus = "disconnected";
            this.content = `重连中...`;
            this.loading = true;
            this.loadingtext = "网络连接断开";
            this.restart();
            break;
        }
      });
    },
    // Step 3 获取远程媒体流
    getremotestream() {
      let _this = this;
      var remotestream = this.rtc.getremotestream();
      console.log(remotestream);
      this.$refs.revideo.srcObject = remotestream; // 添加视频流到标签
      var dialog = document.querySelector(".el-dialog");
      this.$refs.revideo.onloadedmetadata = function onloadedmetadata() {
        console.log(this.videoHeight, this.videoWidth);
        if (this.videoHeight / this.videoWidth !== 1) {
          let ratio = this.videoHeight / this.videoWidth;
          _this.ratio = ratio;
          console.log(ratio);
          _this.$refs.cvideo.style.height = 300 * _this.ratio + "px";
          _this.$refs.modelbody.style.height = 300 * _this.ratio + "px";
          _this.height = 300 * _this.ratio;
          dialog.style.height = _this.height + 44 + "px";
        }
      };
    },
    //信息交互(发送消息到服务器)
    sendmsg(message) {
      this.rtc.sendMessage(message);
      if (this.$parent.iftongbu) {
        // this.$bus.$emit("sendgruopmsg", message);
        sendmessage(message, this.list);
      }
    },
    //鼠标落下
    mousedown(e) {
      let message = {
        name: "",
        offsetWidth: 300,
        offsetHeight: parseInt(this.height),
        button: e.button,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        timeStamp: e.timeStamp,
      };
      if (e.button == 0) {
        this.mdown = true;
        message.name = "touchstart";
      } else if (e.button == 1) {
        message.name = "wheeldown";
        message.wheelDelta = "0x01000073";
      } else if (e.button == 2) {
        message.name = "touchrightstart";
        message.wheelDelta = "0x01000075";
      }

      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    //鼠标抬起
    mouseup(e) {
      // console.log(e)
      let message = {
        name: "",
        offsetWidth: 300,
        offsetHeight: parseInt(this.height),
        button: e.button,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        timeStamp: e.timeStamp,
      };
      if (e.button == 0) {
        if (this.mdown) {
          this.mdown = false;
          message.name = "touchend";
          if (this.rtc) {
            this.sendmsg(message);
          }
        }
      } else if (e.button == 1) {
        message.name = "wheelup";
        message.wheelDelta = "0x01000073";
        if (this.rtc) {
          this.sendmsg(message);
        }
      } else if (e.button == 2) {
        message.name = "touchrightend";
        message.wheelDelta = "0x01000075";
        if (this.rtc) {
          this.sendmsg(message);
        }
      }
    },
    //鼠标移出
    mouseout(e) {
      // console.log(e.type);
      // console.log(e);
      if (this.mdown) {
        this.mdown = false;
        let message = {
          name: "touchend",
          offsetWidth: 300,
          offsetHeight: parseInt(this.height),
          button: e.button,
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          timeStamp: e.timeStamp,
        };
        if (this.rtc) {
          this.sendmsg(message);
        }
      }
    },
    //鼠标移动
    mousemove(e) {
      // console.log(e.type);
      if (this.mdown) {
        let message = {
          name: "touchmove",
          offsetWidth: 300,
          offsetHeight: parseInt(this.height),
          button: e.button,
          offsetX: e.offsetX,
          offsetY: e.offsetY,
          timeStamp: e.timeStamp,
        };
        if (this.rtc) {
          this.sendmsg(message);
        }
      }
    },
    mousewheel(e) {
      e.preventDefault();
      let msg = {
        name: "mousewheel",
        wheelDelta: "",
        timeStamp: e.timeStamp,
      };
      if (e.wheelDelta < 0) {
        msg.wheelDelta = -1; // 滚轮向上
      } else if (e.wheelDelta > 0) {
        msg.wheelDelta = 1; // 滚轮向下
      }
      if (this.rtc) {
        this.sendmsg(msg);
      }
      console.log(e);
    },
    blur() {
      console.log("失去焦点");
    },
    //键盘按下
    onkeydown(e) {
      // console.log(e);
      var message = {
        name: "keydown",
        keyCode: transKeyCode(e.keyCode),
        timeStamp: e.timeStamp,
      };
      //CRTL+V Pressed
      if ((e.ctrlKey || e.metaKey) && e.keyCode == 86) {
        message.name = "clipboard";
        console.log(message);
      }
      if (e.keyCode == 91 || e.keyCode == 18 || e.keyCode == 9) {
        e.preventDefault();
        return;
      }
      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    //键盘抬起
    onkeyup(e) {
      let message = {
        name: "keyup",
        keyCode: transKeyCode(e.keyCode),
        timeStamp: e.timeStamp,
      };
      if (e.keyCode == 91 || e.keyCode == 18 || e.keyCode == 9) {
        e.preventDefault();
        return;
      }
      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    //批量重启
    allrestart() {
      this.rtc.closeConnection();
      this.icestatus = "disconnected";
      this.content = "正在重启...";
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "RebootUPhone",
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      data["UPhoneIds.0"] = this.data.phoneId;
      this.$request.post("?Action=RebootUPhone", data).then((res) => {
        if (res.RetCode == 0) {
          // this.$message.success("正在重启");
          // this.loading = true;
          this.getUPhoneJob(res.JobId);
        } else {
          this.content = "重启失败,请重试！";
          // this.loading = false;
        }
      });
    },
    newphone() {
      this.rtc.closeConnection();
      this.icestatus = "disconnected";
      this.content = "已启动一键新机,正在重启...";
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "RenewUPhone",
        UPhoneIds: [this.data.phoneId],
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      this.$request.post("?Action=RenewUPhone", data).then((res) => {
        if (res.RetCode == 0) {
          // this.jobId = res.JobId;
          this.getUPhoneJob(res.JobId);
        } else {
          this.$message.warning("一键新机启动失败,请重试！");
        }
      });
    },
    addvolume() {
      let message = {
        name: "addvolume",
      };
      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    devolume() {
      let message = {
        name: "devolume",
      };
      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    handlercommand(e) {
      if (e == "forcetk") {
        this.forcetk();
      }
    },
    startapp() {
      let message = {
        name: "startgame",
      };
      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    forcetk() {
      let message = {
        name: "forcetk",
        content:
          "#!/bin/bash\nam force-stop com.zhiliaoapp.musically\nrm -rf  /data/data/com.zhiliaoapp.musically/files/keva/repo/*\nam start com.zhiliaoapp.musically",
      };
      if (this.rtc) {
        this.sendmsg(message);
      }
    },
    //获取重启进程
    getUPhoneJob(jobId) {
      if (this.timmer !== null) {
        clearInterval(this.timmer);
      }
      var payload = {
        Action: "DescribeUPhoneJob",
        ProjectId: this.query.project_id,
        CityId: this.query.city_id,
        JobIds: [jobId],
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      this.timmer = setInterval(() => {
        this.$request
          .post("?Action=DescribeUPhoneJob", {
            ...payload,
          })
          .then((res) => {
            if (res.Jobs[0].State == "SUCCESS" && this.timmer) {
              console.log("重启完毕");
              clearInterval(this.timmer);
              this.restart();
            }
            if (res.Jobs[0].State == "FAILED") {
              clearInterval(this.timmer);
              this.$message.error("重启失败");
            }
            if (res.Jobs[0].State == "PARTIAL_SUCCESS") {
              clearInterval(this.timmer);
              this.$message.error("重启失败");
            }
          });
      }, 5000);
    },
    //重新连接
    restart() {
      if (this.rtc != null) {
        console.log("窗口重连");
        this.rtc.reStart();
      }
    },
    //获取画面延迟回调
    getcurrentround() {
      this.rtc.getNetDelay((roundtime) => {
        this.currentRoundTripTime = roundtime;
      });
    },
    backhome() {
      let message = {
        name: "backhome",
      };
      this.sendmsg(message);
    },
    phonemenu() {
      let message = {
        name: "phonemenu",
      };
      this.sendmsg(message);
    },
    backpage() {
      let message = {
        name: "backlast",
      };
      this.sendmsg(message);
    },
    closemodel(done) {
      if (this.timmer !== null) {
        clearInterval(this.timmer);
      }
      console.log("关闭窗口");
      this.loading = true;
      this.rotate = "portrait";
      this.content = "正在建立连接...";
      this.loadingtext = "加载中";
      this.isresult = false;
      this.isduplicate = false;
      this.rtc.Hangup();
      this.rtc = null;
      this.count = 0;
      this.icestatus = "";
      var dialog = document.querySelector(".el-dialog");
      var li = document.getElementsByTagName("li");
      this.$refs.modelbody.style.transform = `translate3d(-0px, 0px, 0px) rotate(0deg)`;
      Array.from(li).forEach((item) => {
        item.style.transform = `translate3d(0px, 0px, 0px) rotate(0deg)`;
      });
      dialog.style.width = 335 + "px";
      dialog.style.height = 578 + "px";
      this.$refs.cvideo.style.height = 534 + "px";
      this.$refs.modelbody.style.height = 534 + "px";
      this.$emit("closemodelcontrol");
    },
    changerotate() {
      if (this.rotate == "portrait") {
        console.log(this.rotate);
        var dialog = document.querySelector(".el-dialog");
        var li = document.querySelectorAll(".setting-ul li");
        if (this.ratio == 1.7777777777777777) {
          this.rotate = "landscape";
          this.$refs.modelbody.style.transform = `translate3d(99px, -99px, 0px) rotate(-90deg)`;
          Array.from(li).forEach((item) => {
            item.style.transform = `translate3d(0px, 0px, 0px) rotate(90deg)`;
          });
          dialog.style.width = 534 + "px";
          dialog.style.height = 379 + "px";
        }
        // ----- 以下分辨率------
        if (this.ratio == 1.9111111111111112) {
          this.rotate = "landscape";
          this.$refs.modelbody.style.transform = `translate3d(123px, -116px, 0px) rotate(-90deg)`;
          Array.from(li).forEach((item) => {
            item.style.transform = `translate3d(0px, 0px, 0px) rotate(90deg)`;
          });
          dialog.style.width = 620 + "px";
          dialog.style.height = 398 + "px";
        }
        if (this.ratio == 2) {
          this.rotate = "landscape";
          this.$refs.modelbody.style.transform = `translate3d(132px, -132px, 0px) rotate(-90deg)`;
          Array.from(li).forEach((item) => {
            item.style.transform = `translate3d(0px, 0px, 0px) rotate(90deg)`;
          });
          dialog.style.width = 600 + "px";
          dialog.style.height = 379 + "px";
        }
        return;
      }
      if (this.rotate == "landscape") {
        var dialog = document.querySelector(".el-dialog");
        var li = document.querySelectorAll(".setting-ul li");
        if (this.ratio == 1.7777777777777777) {
          this.rotate = "portrait";
          this.$refs.modelbody.style.transform = `translate3d(-0px, 0px, 0px) rotate(0deg)`;
          Array.from(li).forEach((item) => {
            item.style.transform = `translate3d(0px, 0px, 0px) rotate(0deg)`;
          });
          dialog.style.width = 335 + "px";
          dialog.style.height = 578 + "px";
        }
        if (this.ratio == 1.9111111111111112) {
          this.rotate = "portrait";
          this.$refs.modelbody.style.transform = `translate3d(-0px, 0px, 0px) rotate(0deg)`;
          Array.from(li).forEach((item) => {
            item.style.transform = `translate3d(0px, 0px, 0px) rotate(0deg)`;
          });
          dialog.style.width = 375 + "px";
          dialog.style.height = 627 + "px";
        }
        if (this.ratio == 2) {
          this.rotate = "portrait";
          this.$refs.modelbody.style.transform = `translate3d(-0px, 0px, 0px) rotate(0deg)`;
          Array.from(li).forEach((item) => {
            item.style.transform = `translate3d(0px, 0px, 0px) rotate(0deg)`;
          });
          dialog.style.width = 335 + "px";
          dialog.style.height = 644 + "px";
        }
        return;
      }
    },
    closegpsmodel() {
      this.showsetgps = !this.showsetgps;
      this.checkeditem = [];
      var _this = this;
      document.addEventListener("keydown", _this.onkeydown);
      document.addEventListener("keyup", _this.onkeyup);
    },
    showgpsmodel() {
      this.showsetgps = !this.showsetgps;
      var _this = this;
      document.removeEventListener("keydown", _this.onkeydown);
      document.removeEventListener("keyup", _this.onkeyup);
      this.checkeditem.push(this.data.phoneId);
    },
    forceconnect() {
      if (this.rtc) {
        this.rtc.forceconnent();
      }
      console.log("发送offer");
    },
  },
};
</script>
<style lang="scss">
.my-info-dialog {
  .el-dialog__wrapper {
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
  }
  .el-dialog__title {
    -webkit-user-select: none;
    -moz-user-select: none;
    -o-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    color: #409eff;
  }
  .el-dialog__body {
    padding: 0px 0px;
  }
  .el-dialog__header {
    height: 24px;
    padding: 10px 20px 10px;
  }
  .el-dialog {
    width: 335px;
    height: 578px;
  }
  .el-dialog__headerbtn {
    top: 12px;
    right: 9px;
  }
  .el-loading-mask {
    background: #fff;
  }
  .el-result {
    z-index: 100;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .el-result__title p {
    color: #768de2;
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
  .el-dropdown {
    position: absolute;
    bottom: 5px;
    width: 35px;
  }
}

.modelbody {
  width: 335px;
  height: 534px;
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  -o-user-select: none;
  user-select: none;
}
.c-video {
  width: 300px;
  height: 534px;
  position: relative;
  background: #000;
}
.status {
  font-size: 25px;
  color: #67c23a;
  position: absolute;
  top: -15px;
  right: -15px;
  z-index: 99;
}
.warning-status {
  font-size: 25px;
  color: #e6a23c;
  position: absolute;
  top: -15px;
  right: -15px;
  z-index: 99;
}
.setting-area {
  height: 100%;
  flex: 1;
  background: #ecf5ff;
  .setting-ul {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    li {
      font-size: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 5px;
      margin-bottom: 2px;
      cursor: pointer;
      user-select: none;
      &:hover {
        i,
        span {
          color: rgb(56, 96, 244);
        }
      }
      span {
        font-size: 10px;
        text-align: center;
      }
    }
  }
}
</style>
