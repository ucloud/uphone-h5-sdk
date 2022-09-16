<template>
  <el-dialog
    class="isdownload"
    :visible.sync="isdownloadshow"
    @open="open"
    :before-close="closemodel"
  >
    <div class="downloadbody">
      <el-row :gutter="34">
        <el-col :span="7">
          <el-card class="card">
            <p class="cardtitle">
              <i class="el-icon-mobile-phone cardtitleico"></i><span>iOS</span>
            </p>
            <img class="card-img" src="../assets/ios.png" />
            <div class="card-text">
              <el-button
                @click="downloadurl('ios')"
                class="ios-btn"
                type="primary"
                size="mini"
                >iOS用户请扫上方二维码</el-button
              >
            </div>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="card">
            <p class="cardtitle">
              <i class="el-icon-mobile-phone cardtitleico"></i
              ><span>Android</span>
            </p>
            <img class="card-img" src="../assets/android.png" />
            <div class="card-text">
              <el-button
                id="androidbtn"
                @click="downloadurl('android')"
                class="android-btn"
                type="primary"
                size="mini"
                >Android客户端下载</el-button
              >
            </div>
          </el-card>
        </el-col>
        <el-col :span="7">
          <el-card class="card">
            <p class="cardtitle">
              <i class="el-icon-s-platform cardtitleico"></i
              ><span>Windows</span>
            </p>
            <img
              class="card-img"
              style="margin-top: 15px"
              src="../assets/window.png"
            />
            <div class="card-text">
              <el-button
                @click="downloadurl('windows')"
                class="windows-btn"
                type="primary"
                size="mini"
                >Windows客户端下载</el-button
              >
              <p class="win-text">MAC用户请用Chrome浏览器</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["isdownloadshow", "title"],
  data() {
    return {};
  },
  methods: {
    open() {},
    closemodel() {
      this.$emit("closedownloadmodel");
    },
    downloadurl(type) {
      let url;
      if (type == "android") {
        url =
          "http://uphone-client.cn-wlcb.ufileos.com/install/android/2b_uphone/UPhoneClient_0.1.4.apk";
      }
      if (type == "windows") {
        url =
          "http://uphone-client.cn-wlcb.ufileos.com/install/windows/uphone/UPhoneClientSetup.exe";
      }
      if (type == "ios") {
        return;
      }
      var form = document.createElement("form");
      document.getElementById("androidbtn").appendChild(form);
      form.action = url;
      form.submit();
      //   window.location.href="http://uphone-client.cn-wlcb.ufileos.com/install/android/2b_uphone/UPhoneClient_0.1.4.apk"
    },
  },
};
</script>
<style lang="scss">
.isdownload {
  .el-dialog {
    width: 770px;
  }
  .el-dialog__body {
    height: 390px;
    padding: 0;
    overflow: hidden;
  }
  .el-row {
    margin: 0;
    margin-top: 30px;
    padding-left: 80px;
  }
  .card {
    height: 320px;
    overflow: hidden;
    .cardtitle {
      text-align: center;
      height: 50px;
      font-size: 18px;
      font-weight: 800;
      margin-top: 10px;
      .cardtitleico {
        color: rgb(56, 96, 244);
        margin-right: 5px;
      }
    }
    .card-img {
      width: 100%;
    }
    .card-text {
      width: 100%;
      height: 100px;
      text-align: center;
      .ios-btn {
        margin-top: 17px;
        margin-left: -12px;
        background: linear-gradient(
          135deg,
          rgb(100, 136, 252) 0%,
          rgb(56, 96, 244) 100%
        );
        box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
          rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
          rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
      }
      .android-btn {
        margin-top: 18px;
        background: linear-gradient(
          135deg,
          rgb(100, 136, 252) 0%,
          rgb(56, 96, 244) 100%
        );
        box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
          rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
          rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
      }
      .windows-btn {
        margin-top: 35px;
        margin-left: -2px;
        background: linear-gradient(
          135deg,
          rgb(100, 136, 252) 0%,
          rgb(56, 96, 244) 100%
        );
        box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
          rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
          rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
      }
      .win-text {
        font-size: 12px;
        color: rgb(155, 151, 151);
        margin-top: 10px;
      }
    }
  }
}
</style>