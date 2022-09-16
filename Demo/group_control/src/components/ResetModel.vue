<template>
  <el-dialog
    :visible.sync="showreset"
    :before-close="closemodel"
    class="reset-eldialog"
  >
    <div slot="title" class="dialog-title">
      <span>{{ title }}</span>
    </div>
    <div class="warningmsg">
      <span style="color: rgb(56, 96, 244); margin-right: 10px"
        ><i class="el-icon-info"></i
      ></span>
      <span class="warning"
        >云手机恢复出厂后，内部缓存数据将会清空，恢复为下方所选择的出厂镜像。</span
      >
    </div>
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="3">
          <span>云手机镜像</span>
        </el-col>
        <el-col :span="8">
          <el-card
            :body-style="{ padding: '0px' }"
            :class="[{ selected: selectedtype == 'base' }]"
          >
            <div class="baseimg" @click="selectimgtype('base')"></div>
            <div class="baseselect">
              <el-dropdown trigger="click" @command="selectbase">
                <p class="selectp">
                  {{ basename }}<i class="el-icon-arrow-down"></i>
                </p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in baselist"
                    :key="index"
                    :command="item"
                    >{{ item.ImageName }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card
            v-if="customlist.length !== 0"
            :body-style="{ padding: '0px' }"
            :class="[{ selected: selectedtype == 'custom' }]"
          >
            <div class="customimg" @click="selectimgtype('custom')">
              <span class="customspan">自制镜像</span>
            </div>
            <div class="customselect">
              <el-dropdown trigger="click" @command="selectcustom">
                <p class="selectp">
                  {{ customname }}<i class="el-icon-arrow-down"></i>
                </p>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, index) in customlist"
                    :key="index"
                    :command="item"
                    >{{ item.ImageName }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </el-card>
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
        @click="allrefresh"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["showreset", "title", "query", "phonelist","checkeditem"],
  data() {
    return {
      basename: "基础镜像",
      customname: "自制镜像",
      baseId: "",
      customId: "",
      baselist: [],
      customlist: [],
      selectedtype: "base",
    };
  },
  methods: {
    closemodel() {
      this.$emit("closeresetmodel");
      this.selectedtype = "base";
      this.basename = "基础镜像";
      this.customname = "自制镜像";
      this.baseId = "";
      this.customId = "";
    },
    selectbase(item) {
      this.basename = item.ImageName;
      this.baseId = item.ImageId;
    },
    selectcustom(item) {
      this.customname = item.ImageName;
      this.customId = item.ImageId;
    },
    selectimgtype(type) {
      this.selectedtype = type;
    },
    allrefresh() {
      if (this.selectedtype == "base" && this.baseId == "") {
        this.$message.warning("请选择镜像");
        return;
      }
      if (this.selectedtype == "custom" && this.customId == "") {
        this.$message.warning("请选择镜像");
        return;
      }
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "ResetUPhone",
        UPhoneIds: [],
        ImageId: this.selectedtype == "base" ? this.baseId : this.customId,
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      if (this.checkeditem && this.checkeditem.length) {
        this.checkeditem.forEach((item, index) => {
          data.UPhoneIds.push(item);
        });
        this.$request.post("?Action=ResetUPhone", data).then((res) => {
          if (res.RetCode == 0) {
            let msg = {
              type: "恢复出厂",
              jobId: res.JobId,
            };
            this.$emit("getUPhoneJob", msg);
            this.closemodel();
          } else {
            this.$message.error("恢复出厂失败！");
            this.closemodel();
          }
        });
      }
    },
    getUphoneImg() {
      this.$request
        .post("?Action=DescribeUPhoneImage", {
          Action: "DescribeUPhoneImage",
          ProjectId: this.query.project_id,
          CityId: this.query.city_id,
          ProductType: this.$route.query.product_type
            ? this.$route.query.product_type
            : "uphone-server",
        })
        .then((res) => {
          if (res.RetCode == 0) {
            let imglist = res.Images;
            imglist.forEach((item, index) => {
              if (item.ImageType == "BASE") {
                this.baselist.push(item);
              }
              if (item.ImageType == "CUSTOM") {
                this.customlist.push(item);
              }
            });
          }
        });
    },
  },
  mounted() {
    this.getUphoneImg();
  },
};
</script>
<style lang="scss">
.reset-eldialog {
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
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    height: 200px;
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
  .el-dropdown {
    width: 100%;
    height: 100%;
  }
  .el-row {
    margin-bottom: 20px;
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
  .selected {
    border: 1px solid rgb(56, 96, 244);
    .selectp {
      color: rgb(56, 96, 244);
      background-color: rgb(234, 238, 253);
      border-top: 1px solid rgb(56, 96, 244);
    }
  }
  .baseimg {
    width: 100%;
    height: 69px;
    background: url("https://static.ucloud.cn/5592346362d0cfe6b88734fc53e84045.png");
    background-size: cover;
  }
  .customimg {
    width: 100%;
    height: 69px;
    background: url("https://static.ucloud.cn/47c27eedac8c237f0885ef6ff8c44f40.png");
    background-size: cover;
    .customspan {
      color: #fff;
      font-size: 12px;
      display: inline-block;
      margin-top: 40px;
      margin-left: 10px;
    }
  }
  .customselect {
    height: 36px;
  }
  .baseselect {
    height: 36px;
  }
  .selectp {
    height: 100%;
    font-size: 12px;
    line-height: 36px;
    padding-left: 10px;
  }
}
</style>