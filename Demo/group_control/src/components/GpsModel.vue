<template>
  <el-dialog
    :visible.sync="showsetgps"
    @open="open"
    :before-close="closemodel"
    class="setgps-eldialog"
  >
    <div slot="title" class="dialog-title">
      <span>{{ title }}</span>
    </div>
    <div class="warningmsg">
      <span style="color: rgb(56, 96, 244); margin-right: 10px"
        ><i class="el-icon-info"></i
      ></span>
      <span class="warning">后台自动处理数据,确保每台云手机GPS不同</span>
    </div>
    <el-form class="content" label-position="right" label-width="86px">
      <el-form-item label="拾取经纬度:">
        <el-button
          class="pointbtn"
          @click="navigationTo"
          type="primary"
          size="mini"
          >拾取</el-button
        >
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请填写经度' }]"
        label="经度:"
      >
        <el-input-number
          v-model="longitude"
          controls-position="right"
          @change="longitudeChange"
          :min="-180"
          :max="180"
          :precision="1"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        :rules="[{ required: true, message: '请填写纬度' }]"
        label="纬度:"
      >
        <el-input-number
          v-model="latitude"
          controls-position="right"
          @change="latitudeChange"
          :min="-90"
          :max="90"
          :precision="1"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" class="cancelbtn" @click="closemodel"
        >取 消</el-button
      >
      <el-button size="mini" class="confirmbtn" type="primary" @click="setgps"
        >设置</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["showsetgps", "phonelist", "title", "query", "checkeditem"],
  data() {
    const onePoint = (rule, value, callback) => {
      if (!/^[0-9]+([.]{1}[0-9]{1})?$/.test(value)) {
        callback(new Error("最多一位小数！！！"));
      } else {
        callback();
      }
    };
    return {
      longitude: 0,
      latitude: 0,
    };
  },
  methods: {
    open() {},
    closemodel() {
      this.$emit("closegpsmodel");
      this.longitude = "";
      this.latitude = "";
    },
    longitudeChange() {},
    latitudeChange() {},
    setgps() {
      let UPhoneGPSs = [];
      this.checkeditem &&
        this.checkeditem.forEach((item, index) => {
          let longrandom = Math.floor((Math.random() + 0.1) * 100000) / 1000000;
          let latrandom = Math.floor(Math.random() * 100000) / 1000000;
          let Altrandom = Math.floor(Math.random() * 50);
          let longitude = this.longitude;
          let latitude = this.latitude;
          let filongitude =
            Math.floor((longitude + longrandom) * 1000000) / 1000000;
          let filatitude =
            Math.floor((latitude + latrandom) * 1000000) / 1000000;
          console.log(filongitude, filatitude);
          UPhoneGPSs.push({
            UPhoneId: item,
            Longitude: filongitude,
            Latitude: filatitude,
            Altitude: Altrandom,
            Enabled: true,
          });
        });
      this.$request
        .post("?Action=SetUPhoneGPS", {
          Action: "SetUPhoneGPS",
          ProjectId: this.query.project_id,
          CityId: this.query.city_id,
          UPhoneGPSs,
          ProductType: this.$route.query.product_type
            ? this.$route.query.product_type
            : "uphone-server",
        })
        .then((res) => {
          if (res.RetCode == 0) {
            this.$message.success("设置成功");
            this.closemodel();
          } else {
            this.$message.error("设置失败");
          }
        });

      //   console.log(this.longitude, this.latitude);
    },
    navigationTo() {
      window.open("https://api.map.baidu.com/lbsapi/getpoint/index.html");
    },
  },
};
</script>
<style lang="scss">
.setgps-eldialog {
  .dialog-title {
    height: 53px;
    border-bottom: 1px solid rgb(195, 202, 217);
    box-sizing: border-box;
    padding: 16px;
  }
  .dialog-footer {
    height: 63px;
    padding: 15px 16px;
    box-sizing: border-box;
    border-top: 1px solid rgb(195, 202, 217);
    .cancelbtn {
      border: 1px solid rgb(195, 202, 217);
      box-shadow: rgb(0 0 0 / 12%) 0px 2px 3px 0px,
        rgb(227 233 255) 0px -2px 0px 0px inset;
    }
    .confirmbtn {
      background: linear-gradient(
        135deg,
        rgb(100, 136, 252) 0%,
        rgb(56, 96, 244) 100%
      );
      box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
        rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
        rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
    }
  }
  .pointbtn {
    background: linear-gradient(
      135deg,
      rgb(100, 136, 252) 0%,
      rgb(56, 96, 244) 100%
    );
    box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
      rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
      rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
  }
  .warningmsg {
    padding: 10px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(210, 214, 234);
    background: rgb(250, 250, 252);
    font-size: 12px;
    color: rgb(10, 22, 51);
  }
  .content {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .el-dialog {
    width: 700px;
  }
  .el-dialog__body {
    height: 250px;
    padding: 0;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
</style>