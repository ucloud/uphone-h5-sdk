<template>
  <el-dialog
    :visible.sync="showresolu"
    :before-close="closemodel"
    class="setresolu-eldialog"
  >
    <div slot="title" class="dialog-title">
      <span>{{ title }}</span>
    </div>
    <el-form
      :model="formvalue"
      ref="setresolute"
      label-position="right"
      label-width="86px"
    >
      <el-form-item label="分辨率:" prop="resolutionvalue">
        <el-select
          v-model="formvalue.resolutionvalue"
          clearable
          placeholder="请选择分辨率"
          @change="selectchange"
        >
          <el-option
            v-for="item in resolutoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Dpi:" prop="dpinum">
        <el-slider v-model="formvalue.dpinum" :min="160" :max="480" show-input>
        </el-slider>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" class="cancelbtn" @click="closemodel"
        >取 消</el-button
      >
      <el-popconfirm @confirm="setresolute" :title="confirmtitle">
        <el-button
          size="mini"
          :loading="loading"
          style="margin-left: 10px"
          slot="reference"
          type="primary"
          class="confirmbtn"
          >{{ btntext }}</el-button
        >
      </el-popconfirm>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["showresolu", "title", "phonelist", "query", "checkeditem"],
  data() {
    return {
      resolutionvalue: "",
      resolutoptions: [
        {
          value: "1",
          label: "540x960",
        },
        {
          value: "2",
          label: "720x1280",
        },
        {
          value: "3",
          label: "720x1440",
        },
        // {
        //   value: "4",
        //   label: "1080x2160",
        // },
      ],
      formvalue: {
        dpinum: 160,
        resolutionvalue: "",
      },
      confirmtitle: "设置分辨率&Dpi将重启云手机,确定设置吗?",
      loading: false,
      btntext: "设置",
      jobId: "",
    };
  },
  watch: {},
  methods: {
    selectchange(value) {
      if (value == 1) {
        this.formvalue.dpinum = 240;
      }
      if (value == 2) {
        this.formvalue.dpinum = 320;
      }
      if (value == 3) {
        this.formvalue.dpinum = 320;
      }
      if (value == 4) {
        this.formvalue.dpinum = 480;
      }
    },
    closemodel() {
      this.$emit("closeresolumodel");
      this.$refs["setresolute"].resetFields();
      this.btntext = "设置";
      this.jobId = "";
      this.loading = false;
    },
    setresolute() {
      this.loading = true;
      this.btntext = "设置中,即将重启云手机";
      var payload = {
        Action: "SetUPhoneConfig",
        ProjectId: this.query.project_id,
        CityId: this.query.city_id,
        UPhoneIds: [],
        Resolution: "",
        Async: "1",
        Dpi: String(this.formvalue.dpinum),
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      this.checkeditem.forEach((item, index) => {
        payload.UPhoneIds.push(item);
      });
      if (this.formvalue.resolutionvalue == 1) {
        payload.Resolution = "540x960";
      }
      if (this.formvalue.resolutionvalue == 2) {
        payload.Resolution = "720x1280";
      }
      if (this.formvalue.resolutionvalue == 3) {
        payload.Resolution = "720x1440";
      }
      if (this.formvalue.resolutionvalue == 4) {
        payload.Resolution = "1080x2160";
      }
      this.$request
        .post("?Action=SetUPhoneConfig", {
          ...payload,
        })
        .then((res) => {
          if (res.RetCode == 0) {
            let msg = {
              type: "设置分辨率",
              jobId: res.JobId,
            };
            console.log(this.jobId);
            this.$emit("getUPhoneJob", msg);
            this.closemodel();
          } else {
            this.$message.error("设置失败,请重试");
            this.closemodel();
          }
        });
    },
  },
};
</script>
<style lang="scss">
.setresolu-eldialog {
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
  .el-dialog {
    width: 700px;
    height: 348px;
  }
  .el-dialog__body {
    height: 169px;
    overflow: auto;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
</style>