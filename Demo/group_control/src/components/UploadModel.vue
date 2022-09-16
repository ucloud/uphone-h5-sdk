<template>
  <el-dialog
    :visible.sync="showupload"
    @open="open"
    :before-close="closemodel"
    class="upload-eldialog"
  >
    <div style="-webkit-user-select: none" slot="title" class="dialog-title">
      <span>批量上传</span>
    </div>
    <div class="content">
      <div class="warningmsg">
        <span style="color: rgb(56, 96, 244); margin-right: 10px"
          ><i class="el-icon-info"></i
        ></span>
        <span class="warning">
          上传后的文件存放在云手机:<span
            style="font-weight: 800; color: rgb(56, 96, 244)"
            >桌面/文件/下载</span
          >，如上传文件为apk则自动安装</span
        >
      </div>
      <div class="middle">
        <el-row>
          <el-col>
            <el-tree
              ref="tree"
              :props="props"
              :data="tree"
              show-checkbox
              node-key="id"
              :expand-on-click-node="true"
              empty-text="暂无分组"
              @check="
                (click, checked) => {
                  treecheck(click, checked);
                }
              "
            >
            </el-tree>
          </el-col>
        </el-row>
        <el-row style="margin-left: 10px" :gutter="20">
          <el-col :span="10">
            <el-upload
              class="upload-demo"
              ref="upload"
              :show-file-list="false"
              action="https://upload-proxy.cn-wlcb.ufileos.com"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="onchangefile"
              :multiple="true"
            >
            </el-upload>
            <el-button
              @click="showmsg"
              class="uploadbtn"
              size="mini"
              type="primary"
              >添加文件</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-table style="width: 100%" :data="showfileList" :stripe="true">
              <el-table-column
                prop="filename"
                label="文件名"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="filesize"
                label="文件大小"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="filetype"
                label="文件类型"
                width="100"
              ></el-table-column>
              <el-table-column
                fixed="right"
                prop="fileprogress"
                label="进度"
                width="100"
              ></el-table-column>
              <el-table-column
                fixed="right"
                prop="filestate"
                label="状态"
                width="100"
              >
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="handleClick(scope.row)"
                    type="text"
                    size="mini"
                    class="deletbtn"
                    >移除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button size="mini" class="cancelbtn" @click="closemodel"
        >取 消</el-button
      >
      <el-button size="mini" class="confirmbtn" type="primary" @click="submit"
        >上传</el-button
      >
    </div> -->
  </el-dialog>
</template>
<script>
import UFile from "../utils/ufile";
export default {
  props: {
    showupload: Boolean,
    query: Object,
    treedata: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tree: this.treedata,
      props: {
        label: "label",
        children: "children",
      },
      form: {
        UPhoneIds: [],
        Action: "ImportFile",
        FileName: "",
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        URL: "",
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      },
      timmer: null,
      fileList: [],
      showfileList: [],
      less512List: [],
      more512List: [],
      phonelist: [],
      uploadToken: "",
      downloadUrl: "",
      bucketName: "upload-proxy",
      bucketUrl: "https://upload-proxy.cn-wlcb.ufileos.com",
      bucketRegion: "cn-wlcb",
      uFile_: null,
      importForm: null,
    };
  },
  watch: {
    treedata: function (newVal) {
      this.tree = newVal;
    },
  },
  mounted() {},
  methods: {
    showmsg() {
      if (this.form.UPhoneIds.length == 0) {
        this.$message.warning("请选择云手机");
        return;
      } else {
        this.$refs["upload"].$refs["upload-inner"].handleClick();
      }
    },
    treecheck(click, checked) {
      var checkedlist = this.$refs.tree.getCheckedNodes(false, true);
      var phoneList = [];
      checkedlist.map((item, index) => {
        if (item.isLeaf == true) {
          phoneList.push(item);
        }
      });
      this.phonelist = phoneList;
      this.form.UPhoneIds = phoneList.map((item, index) => {
        return item.phoneId;
      });
    },
    open() {
      this.tree = this.treedata;
    },
    closemodel() {
      this.tree = [];
      this.form = {
        UPhoneIds: [],
        Action: "ImportFile",
        FileName: "",
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        URL: "",
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      this.fileList = [];
      this.showfileList = [];
      this.$emit("closeuploadmodel");
    },
    handleClick(row) {
      this.showfileList.forEach((item, index) => {
        if (item.uid == row.uid) {
          this.showfileList.splice(index, 1);
          this.fileList.splice(index, 1);
        }
      });
      // console.log(row);
    },
    onchangefile(file, fileList) {
      console.log(file);
      console.log(fileList);
      let size = file.size;
      if (size < 1024) {
        size = `${file.size}B`;
      }
      if (size / 1024 < 1024) {
        size = `${Math.round((size / 1024) * 100) / 100}KB`;
      }
      if (size / 1024 / 1024 < 1024) {
        size = `${Math.round((size / 1024 / 1024) * 100) / 100}MB`;
      }
      if (size / 1024 / 1024 / 1024 < 1024) {
        size = `${Math.round((size / 1024 / 1024 / 1024) * 100) / 100}GB`;
      }
      if (size / 1024 / 1024 / 1024 / 1024 < 1024) {
        size = `${
          Math.round((size / 1024 / 1024 / 1024 / 1024) * 100) / 100
        }TB`;
      }
      let filedata = {
        uid: file.uid,
        file: file.raw,
        filename: file.name,
        filesize: size,
        filetype: file.raw.type ? file.raw.type : "未知",
        filestate: "上传中",
        fileprogress: 0,
      };
      if (this.showfileList.length) {
        try {
          this.showfileList.forEach((item, index) => {
            if (item.filename == filedata.filename) {
              throw new error();
            }
          });
          this.showfileList.push(filedata);
          this.fileList.push(filedata.file);
          this.submit();
        } catch (error) {
          // console.log(item);
          // console.log(filedata);
        }
      } else {
        this.showfileList.push(filedata);
        this.fileList.push(filedata.file);
        this.submit();
      }
    },
    submit() {
      if (this.uFile_ == null) {
        this.uFile_ = new UFile(
          this.bucketName,
          this.bucketUrl,
          this.bucketRegion,
          this.query.project_id
        );
      }
      this.fileList.forEach((item, index) => {
        if (item.size < 512 * 1024 * 1024) {
          if (this.less512List.length) {
            this.less512List.forEach((eitem, eindex) => {
              if (eitem.filename !== item.name) {
                // this.less512List.push(item);
                this.less512List = [item];
              }
            });
          } else {
            // this.less512List.push(item);
            this.less512List = [item];
          }
        } else {
          if (this.more512List.length) {
            this.more512List.forEach((mitem, mindex) => {
              if (mitem.filename !== item.name) {
                this.more512List = [item];
              }
            });
          } else {
            this.more512List = [item];
          }
        }
      });
      if (this.less512List.length) {
        this.commonUpload();
      }
      if (this.more512List.length) {
        this.multipartUpload();
      }
    },
    commonUpload() {
      var that = this;
      var successCallBack = function (res) {
        console.log(JSON.stringify(res));
        that.downloadToPhone(res);
      };
      var errorCallBack = function (res) {
        console.error("errorCallBack", res);
      };
      var progressCallBack = function (res) {
        var percent = parseInt(res.progress * 100);
        var percentComplete = percent + "%";
        // console.log(percentComplete);
        that.showfileList.forEach((item) => {
          if (item.uid == res.fileUid) {
            if (percentComplete == "100%") {
              item.fileprogress = "99%";
              item.filestate = "正在同步至云手机";
            } else {
              item.fileprogress = percentComplete;
              item.filestate = "上传中";
            }
          }
        });
      };
      that.uFile_.batchUpload(
        this.less512List,
        successCallBack,
        errorCallBack,
        progressCallBack
      );
    },
    multipartUpload() {
      var successList = [];
      var currentIndex = 0;
      var that = this;
      var successCallBack = function (res) {
        successList.push(res.file);
        if (that.more512List.length !== successList.length) {
          currentIndex++;
          that.uFile_.sliceUpload(
            {
              file: that.more512List[currentIndex],
            },
            successCallBack,
            errorCallBack,
            progressCallBack
          );
        }
        console.log(res);
        that.downloadToPhone(res);
      };
      var errorCallBack = function (res) {
        console.error("multipartUpload errorCallBack: ", res);
      };
      var progressCallBack = function (res) {
        var percent = parseInt(res.value * 100);
        var percentComplete = percent + "%";
        // console.log(percentComplete);
        that.showfileList.forEach((item) => {
          if (item.uid == res.fileUid) {
            if (percentComplete == "100%") {
              item.fileprogress = "99%";
              item.filestate = "正在同步至云手机";
            } else {
              item.filestate = "上传中";
              item.fileprogress = percentComplete;
            }
          }
        });
      };
      that.uFile_.sliceUpload(
        {
          file: this.more512List[currentIndex],
        },
        successCallBack,
        errorCallBack,
        progressCallBack
      );
    },
    downloadToPhone(data) {
      var that = this;
      if (this.uFile_ == null) {
        return;
      }
      var request = {
        fileName: data.fileName,
        fileUid: data.fileUid,
      };
      var successCallBack = function (res) {
        that.form.FileName = request.fileName;
        that.form.URL = res.Url;
        that.form.uid = request.fileUid;
        console.log(res);
        that.uploadfiles();
      };
      var errorCallBack = function (res) {
        console.error("errorCallBack", res);
      };
      that.uFile_.getDownloadUrl(request, successCallBack, errorCallBack);
    },
    uploadfiles() {
      let data = { ...this.form };
      // console.log(data);
      this.$request.post("?Action=ImportFile", data).then((res) => {
        if (res.RetCode == 0) {
          this.getUphoneJob(res.JobId, data.uid);
        } else {
          this.showfileList.forEach((item, index) => {
            if (item.uid == data.uid) {
              item.filestate = "上传失败";
            }
          });
        }
      });
    },
    getUphoneJob(JobId, uid) {
      let jobId = JobId;
      let thisuid = uid;
      var payload = {
        Action: "DescribeUPhoneJob",
        ProjectId: this.query.project_id,
        CityId: this.query.city_id,
        JobIds: [JobId],
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };

      this.$request
        .post("?Action=DescribeUPhoneJob", {
          ...payload,
        })
        .then((res) => {
          if (res.Jobs[0].State == "SUCCESS") {
            this.showfileList.forEach((item, index) => {
              if (item.uid == uid) {
                item.fileprogress = "100%";
                item.filestate = "已完成";
              }
            });
          } else if (res.Jobs[0].State == "FAILED") {
            this.showfileList.forEach((item, index) => {
              if (item.uid == uid) {
                item.fileprogress = "99%";
                item.filestate = "同步至云手机失败";
              }
            });
          } else if (res.Jobs[0].State == "PARTIAL_SUCCESS") {
            this.showfileList.forEach((item, index) => {
              if (item.uid == uid) {
                item.fileprogress = "99%";
                item.filestate = "同步至云手机失败";
              }
            });
          } else {
            this.getUphoneJob(jobId, thisuid);
          }
        });
    },
  },
};
</script>
<style   lang="scss">
.upload-eldialog {
  .dialog-title {
    height: 53px;
    border-bottom: 1px solid rgb(195, 202, 217);
    box-sizing: border-box;
    padding: 16px;
  }
  .uploadinput {
    background: linear-gradient(
      135deg,
      rgb(100, 136, 252) 0%,
      rgb(56, 96, 244) 100%
    );
    box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
      rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
      rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
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

  .content {
    width: 100%;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    .warningmsg {
      position: fixed;
      width: 800px;
      z-index: 10;
      padding: 10px 16px;
      box-sizing: border-box;
      border-bottom: 1px solid rgb(210, 214, 234);
      background: rgb(250, 250, 252);
      font-size: 12px;
      color: rgb(10, 22, 51);
    }
    .middle {
      margin-top: 38px;
      height: 449px;
      overflow: auto;
      box-sizing: border-box;
      padding: 25px;
      .uploadbtn {
        background: linear-gradient(
          135deg,
          rgb(100, 136, 252) 0%,
          rgb(56, 96, 244) 100%
        );
        box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
          rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
          rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
      }
      .deletbtn {
        color: rgb(56, 96, 244);
      }
    }
    .el-row {
      margin-bottom: 20px;
    }
    .el-input__inner {
      height: 30px;
    }
  }
  .us3btn {
    a {
      text-decoration: none;
      color: #fff;
    }
    background: linear-gradient(
      135deg,
      rgb(100, 136, 252) 0%,
      rgb(56, 96, 244) 100%
    );
    box-shadow: rgb(92 118 232) 0px 2px 4px -1px,
      rgb(0 0 0 / 12%) 0px -3px 0px 0px inset,
      rgb(0 0 0 / 12%) 0px 1px 0px 0px inset;
  }
  .el-dialog {
    width: 800px;
    max-height: 600px;
  }
  .el-dialog__body {
    height: 489px;
    padding: 0;
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