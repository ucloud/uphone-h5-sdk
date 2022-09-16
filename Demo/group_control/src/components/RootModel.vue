<template>
  <el-dialog
    :visible.sync="showroot"
    :before-close="closemodel"
    class="root-eldialog"
  >
    <div slot="title" class="dialog-title">
      <span>{{ title }}</span>
    </div>
    <div class="warningmsg">
      <span style="color: rgb(56, 96, 244); margin-right: 10px"
        ><i class="el-icon-info"></i
      ></span>
      <span class="warning">开启ROOT后云手机将会重启</span>
    </div>
    <div class="content">
      <el-row>
        <el-col :span="5">添加ROOT白名单</el-col>
        <el-col :span="18">
          <el-input
            type="textarea"
            placeholder="请输入应用包名"
            v-model="textcontent"
          ></el-input>
        </el-col>
      </el-row>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" class="cancelbtn" @click="closemodel"
        >取消</el-button
      >
      <el-button
        size="mini"
        type="primary"
        style="margin-left: 10px"
        class="confirmbtn"
        @click="allroot"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["showroot", "title", "query", "phonelist"],
  data() {
    return {
      textcontent: "",
    };
  },
  methods: {
    closemodel() {
      this.$emit("closerootmodel");
    },
    allroot() {
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "SetUPhoneRootMode",
        UPhoneIds: [],
        PkgNames: [this.textcontent],
        Root: true,
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      if (this.phonelist && this.phonelist.length) {
        this.phonelist.forEach((item, index) => {
          data.UPhoneIds.push(item.phoneId);
        });
        this.$request.post("?Action=SetUPhoneRootMode", data).then((res) => {
          if (res.RetCode == 0) {
            let msg = {
              type: "重启",
              jobId: res.JobId,
            };
            this.$emit("getUPhoneJob", msg);
            this.closemodel();
          } else {
            this.$message.warning("开启ROOT失败");
            this.closemodel();
          }
        });
      }
    },
  },
  mounted() {},
};
</script>
<style lang="scss">
.root-eldialog {
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
  .el-row {
    margin-top: 20px;
  }
  .el-dialog {
    width: 700px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
    height: 200px;
    overflow: auto;
  }
  .el-dialog__footer {
    padding: 0;
  }
  .content {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  .warningmsg {
    padding: 10px 16px;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(210, 214, 234);
    background: rgb(250, 250, 252);
    font-size: 12px;
    color: rgb(10, 22, 51);
  }
}
</style>