<template>
  <div id="wrap">
    <div :class="['lefttree', { foldlefttree: fold == true }]">
      <div :class="['lefttitle', { foldlefttitle: fold == true }]">
        <div class="title">
          <i class="el-icon-s-platform iconcolor"></i
          ><span style="margin-left: 10px">云手机群控管理</span>
        </div>
        <!-- <div class="">
          <span>{{ cityId == "cn-wlcb" ? "华北二" : "广州" }}</span>
        </div> -->
        <div class="fold" @click="foldchange(true)">
          <i class="el-icon-s-fold iconfold"></i>
        </div>
      </div>
      <!-- <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input> -->
      <el-tree
        :class="[{ eltree: fold == true }]"
        ref="tree"
        :props="props"
        :data="treedata"
        show-checkbox
        node-key="id"
        :render-content="renderContent"
        :expand-on-click-node="true"
        empty-text="暂无分组"
        @check="
          (click, checked) => {
            treecheck(click, checked);
          }
        "
      >
      </el-tree>
      <div
        :class="['unfoldpre', { unfold: fold == true }]"
        @click="foldchange(false)"
      >
        <i class="el-icon-s-unfold iconfold"></i>
      </div>
    </div>
    <div id="groupview">
      <div class="group-top">
        <div class="top-left">
          <el-checkbox
            :indeterminate="isIndeterminate"
            @change="ifallchecked"
            style="margin-right: 10px"
            v-model="checked"
            >全部</el-checkbox
          >
          <el-switch
            v-model="iftongbu"
            @change="ifconnection"
            active-text="同步操作"
          ></el-switch>
        </div>
        <div class="top-right">
          <el-button
            class="el-button-style"
            type="primary"
            size="mini"
            @click="showdownloadmodel"
            style="linear-gradient(135deg, rgb(100, 136, 252) 0%, rgb(56, 96, 244) 100%); margin-top: 14px"
          >
            客户端下载<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-button
            class="el-button-style"
            style="linear-gradient(135deg, rgb(100, 136, 252) 0%, rgb(56, 96, 244) 100%); margin-right: 10px; margin-top: 14px"
            type="primary"
            size="mini"
            @click="showuploadmodel"
            :disabled="controldisabled"
            >批量上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
          <el-popconfirm @confirm="allrestart" :title="restarttitle">
            <el-button
              class="el-button-style"
              slot="reference"
              style="margin-right: 10px"
              type="primary"
              size="mini"
              :disabled="controldisabled"
              @click="ifallrestart"
              >批量重启<i class="el-icon-refresh el-icon--right"></i
            ></el-button>
          </el-popconfirm>
          <el-popconfirm @confirm="allnew" :title="newtitle">
            <el-button
              slot="reference"
              class="el-button-style"
              style="margin-right: 10px"
              type="primary"
              size="mini"
              :disabled="controldisabled"
              @click="isallnew"
              >批量一键新机<i class="el-icon-mobile el-icon--right"></i
            ></el-button>
          </el-popconfirm>
          <el-dropdown trigger="click" :hide-on-click="false">
            <el-button
              :disabled="controldisabled"
              class="el-button-style"
              type="primary"
              size="mini"
            >
              更多批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <p
                  style="display: inline-block; width: 100%"
                  @click="showresolumodel"
                >
                  设置分辨率
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  style="display: inline-block; width: 100%"
                  @click="showgpsmodel"
                >
                  设置GPS
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <p
                  style="display: inline-block; width: 100%"
                  @click="showresetmodel"
                >
                  恢复出厂
                </p>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-popconfirm @confirm="allroot(true)" :title="roottitle">
                  <p
                    slot="reference"
                    style="display: inline-block; width: 100%"
                    @click="isallroot('开启')"
                  >
                    开启ROOT
                  </p>
                </el-popconfirm>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-popconfirm @confirm="allroot(false)" :title="roottitle">
                  <p
                    style="display: inline-block; width: 100%"
                    slot="reference"
                    @click="isallroot('关闭')"
                  >
                    关闭ROOT
                  </p>
                </el-popconfirm>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div
        :class="[
          { groupbottom4: pagesize == 4 },
          { groupbottom6: pagesize == 6 },
          { groupbottom8: pagesize == 8 },
          { groupbottom12: pagesize == 12 },
          { groupbottom24: pagesize == 24 },
          { groupbottom48: pagesize == 48 },
        ]"
      >
        <div
          v-for="(item, index) in showphonelist"
          :key="item.phoneId"
          :class="[
            { vcontain4: pagesize == 4 },
            { vcontain6: pagesize == 6 },
            { vcontain8: pagesize == 8 },
            { vcontain12: pagesize == 12 },
            { vcontain24: pagesize == 24 },
            { vcontain48: pagesize == 48 },
          ]"
        >
          <div class="videoitem" @click="showmodelcontrol(item, index)">
            <video-item
              ref="videoitem"
              :id="item.phoneId"
              :query="query"
            ></video-item>
          </div>
          <p
            style="
              font-size: 12px;
              color: #000;
              text-align: center;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            "
            :title="item.phoneId"
          >
            <el-checkbox
              v-model="item.itemchecked"
              @change="
                (val) => {
                  ifitemchecked(val, item.phoneId);
                }
              "
              >{{ item.phoneId }}</el-checkbox
            >
          </p>
        </div>
      </div>
      <div class="bottom-page">
        <p class="selectcount">
          已选择 <span>{{ checkednum }}</span> 台云机
        </p>
        <!-- <p @click="showprogress" class="progresscount">任务进度({{jobprogress}}%)</p> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 6, 8, 12]"
          :page-size="pagesize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
          popper-class="pagination-style"
        >
        </el-pagination>
      </div>
    </div>

    <video-model
      @closemodelcontrol="closemodelcontrol"
      :showmodel="showmodel"
      :data="modeldata"
      :query="query"
      :iftongbu="iftongbu"
      :list="phonelist"
    />
    <upload-model
      @closeuploadmodel="closeuploadmodel"
      :showupload="showupload"
      :query="query"
      :treedata="treedata"
    />
    <if-connection
      @closeconnectmodel="closeconnectmodel"
      :showconnection="showconnection"
      :content="content"
    />
    <gps-model
      title="批量设置GPS"
      :phonelist="phonelist"
      :checkeditem="checkeditem"
      @closegpsmodel="closegpsmodel"
      :showsetgps="showsetgps"
      :query="query"
    />
    <resolu-model
      title="批量设置分辨率"
      :phonelist="phonelist"
      :checkeditem="checkeditem"
      @closeresolumodel="closeresolumodel"
      @getUPhoneJob="getUPhoneJob"
      :showresolu="showresolu"
      :query="query"
    />
    <reset-model
      title="恢复出厂"
      @getUPhoneJob="getUPhoneJob"
      :phonelist="phonelist"
      :checkeditem="checkeditem"
      :showreset="showreset"
      :query="query"
      @closeresetmodel="closeresetmodel"
    />
    <root-model
      title="开启ROOT"
      :query="query"
      :showroot="showroot"
      :phonelist="phonelist"
      :checkeditem="checkeditem"
      @getUPhoneJob="getUPhoneJob"
      @closerootmodel="closerootmodel"
    />
    <download-model
      title="客户端下载"
      :isdownloadshow="isdownloadshow"
      @closedownloadmodel="closedownloadmodel"
    />
    <progress-model
      title="进程"
      :showprogress="isprogressshow"
      @closeprogressmodel="closeprogressmodel"
    />
  </div>
</template>

<script>
import ProgressModel from "../components/ProgressModel.vue";
import DownloadModel from "../components/DownloadModel.vue";
import VideoItem from "../components/VideoItem.vue";
import VideoModel from "../components/VideoModel.vue";
import UploadModel from "../components/UploadModel.vue";
import IfConnection from "../components/IfConnection.vue";
import GpsModel from "../components/GpsModel.vue";
import ResoluModel from "../components/ResoluModel.vue";
import ResetModel from "../components/ResetModel.vue";
import RootModel from "../components/RootModel.vue";
import { groupconnection } from "../utils/groupconnection";
export default {
  name: "groupview",
  data() {
    return {
      props: {
        label: function (data, node) {
          if (node.isLeaf) {
            let index = data.label.indexOf("-");
            let filtlable = data.label.substring(index + 1);
            let label = `${data.uphoneName}(${filtlable})`;
            return label;
          } else {
            return data.label;
          }
        },
        children: "children",
        // disabled: this.disabledcheck,
      },
      filterText: "",
      showmodel: false,
      showupload: false,
      showconnection: false,
      content: "",
      showsetgps: false,
      showresolu: false,
      showreset: false,
      showroot: false,
      isdownloadshow: false,
      isprogressshow: false,
      modeldata: {},
      treeindex: "",
      loading: true,
      loadingtext: "加载中",
      treedata: [],
      groupdata: [],
      checkedlist: [],
      checkeditem: [],
      phonelist: [],
      prephonelist: [],
      showphonelist: [],
      prevshowphonelist: [],
      showvideolist: [],
      cityId: "",
      query: {},
      currentPage: 1,
      total: 0,
      rtclist: [],
      status: "在线",
      checked: false,
      checkednum: 0,
      isIndeterminate: false,
      itemchecked: false,
      restarttitle: "",
      refreshtitle: "",
      roottitle: "",
      newtitle: "",
      filterText: "",
      jobId: "",
      timmer: null,
      pagesize: 4,
      iftongbu: false,
      describeuphone: [],
      describeuphoneserver: [],
      fold: false,
      controldisabled: false,
      jobprogress:0
    };
  },
  components: {
    VideoItem,
    VideoModel,
    UploadModel,
    IfConnection,
    GpsModel,
    ResoluModel,
    ResetModel,
    RootModel,
    DownloadModel,
    ProgressModel,
  },
  created() {},
  beforeMount() {
    var query = this.$route.query;
    this.query = query;
  },
  mounted() {
    this.$notify({
      title: "群控操作使用说明",
      dangerouslyUseHTMLString: true,
      message:
        "<p class='notify'><span>1.</span>左侧选择云手机</p><p class='notify'><span>2.</span>开启同步操作</p><p class='notify'><span>3.</span>勾选需要同步操作的云手机</p>",
      duration: 10000,
    });
    document.title = "群控管理";
    var query = this.$route.query;
    this.getGroupTree(query);
  },
  computed: {
    getrtclist() {
      return this.$store.state.rtclist;
    },
  },
  watch: {
    getrtclist: {
      handler(newVal, oldVal) {
        this.rtclist = newVal;
      },
      deep: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    disabledcheck() {
      return true;
    },
    foldchange(v) {
      this.fold = v;
    },
    ifallchecked(val) {
      this.isIndeterminate = false;
      this.checked = val;
      if (val == true) {
        this.checkednum = this.phonelist.length;
        this.phonelist.forEach((item) => {
          this.checkeditem.push(item.phoneId);
        });
      } else {
        this.checkednum = 0;
        this.checkeditem = [];
      }
      this.phonelist = this.phonelist.map((item) => {
        item.itemchecked = val;
        return item;
      });
      this.showphonelist = this.showphonelist.map((item) => {
        item.itemchecked = val;
        return item;
      });
    },
    ifconnection(val) {
      if (val == true) {
        this.showconnectmodel();
        this.iftongbu = true;
      } else {
        this.iftongbu = false;
      }
    },
    ifitemchecked(val, phoneId) {
      console.log(val, phoneId);
      if (val == false) {
        --this.checkednum;
        this.checkeditem.forEach((item, index) => {
          if (item == phoneId) {
            this.checkeditem.splice(index, 1);
          }
        });
      } else {
        ++this.checkednum;
        this.checkeditem.push(phoneId);
      }
      if (this.phonelist.length == this.checkednum) {
        this.isIndeterminate = false;
        this.checked = true;
      }
      if (this.phonelist.length > this.checkednum && this.checkednum !== 0) {
        this.isIndeterminate = true;
      }
      if (this.phonelist.length > this.checkednum && this.checkednum == 0) {
        this.isIndeterminate = false;
        this.checked = false;
      }
      this.phonelist = this.phonelist.map((item) => {
        if (item.phoneId == phoneId) {
          item.itemchecked = val;
        }
        return item;
      });
      console.log(this.phonelist);
      this.showphonelist = this.showphonelist.map((item) => {
        if (item.phoneId == phoneId) {
          item.itemchecked = val;
        }
        return item;
      });
      console.log(this.showphonelist);
    },
    getListbusiness() {
      return new Promise((resolve, reject) => {
        this.$request
          .post("?Action=ListBusinessGroup", {
            Action: "ListBusinessGroup",
            ProjectId: this.query.project_id,
            CityId: this.query.city_id,
            ProductType: this.$route.query.product_type
              ? this.$route.query.product_type
              : "uphone-server",
          })
          .then((res) => {
            if (res.RetCode == 0) {
              let data = res.Infos;
              resolve(data);
            }
          });
      });
    },
    getDesuphone() {
      return new Promise((resolve, reject) => {
        this.$request
          .post("?Action=DescribeUPhone", {
            Action: "DescribeUPhone",
            ProjectId: this.query.project_id,
            CityId: this.query.city_id,
            IsAll: true,
            ProductType: this.$route.query.product_type
              ? this.$route.query.product_type
              : "uphone-server",
          })
          .then((res) => {
            if (res.RetCode == 0) {
              let data = res.UPhones;
              resolve(data);
            }
          });
      });
    },
    //获取分组树
    getGroupTree(query) {
      Promise.all([this.getDesuphone(), this.getListbusiness()]).then(
        ([uphones, listbusiness]) => {
          var list = JSON.parse(JSON.stringify(listbusiness));
          const filterlist = list.filter((item, index) => {
            item["children"] = [];
            uphones.map((eitem, eindex) => {
              eitem["label"] = eitem.UPhoneId;
              eitem["value"] = eitem.UPhoneId;
              eitem["phoneId"] = eitem.UPhoneId;
              eitem["cityId"] = eitem.CityId;
              eitem["isLeaf"] = true;
              eitem["uphoneName"] = eitem.UPhoneName;
              if (item.BusinessName == eitem.Tag) {
                item["id"] = index;
                item["label"] = item.BusinessName;
                item["isLeaf"] = false;
                item["children"].push(eitem);
              }
            });
            if (item.children.length !== 0) {
              return true;
            } else {
              return false;
            }
          });
          this.treedata = filterlist;
        }
      );
    },
    renderContent(h, { node, data, store }) {
      // console.log(node)
      if (node.isLeaf) {
        return (
          <span class="custom-tree-node">
            <span>
              <el-popover
                placement="right"
                width="200"
                trigger="hover"
                open-delay={300}
              >
                <p style="font-size:12px">
                  <span style="color:rgb(56, 96, 244);font-weight:700">
                    云手机名称 :{" "}
                  </span>
                  {node.data.uphoneName}
                </p>
                <p style="font-size:12px">
                  <span style="color:rgb(56, 96, 244);font-weight:700">
                    资源ID :{" "}
                  </span>
                  {node.data.phoneId}
                </p>
                <p style="font-size:12px">
                  <span style="color:rgb(56, 96, 244);font-weight:700">
                    地域 :{" "}
                  </span>
                  {node.data.CityName}
                </p>
                <el-button slot="reference" size="mini" type="text">
                  <i style="color:rgb(56, 96, 244)" class="el-icon-mobile"></i>{" "}
                  {node.label}
                </el-button>
              </el-popover>
            </span>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <span> {node.label}</span>
          </span>
        );
      }
    },

    // 开启主控窗口并断开videoitem连接
    showmodelcontrol(treeitem, index) {
      if (this.controldisabled) {
        return;
      }
      console.log("showmodelcontrol start.");
      this.treeindex = index;
      this.modeldata = treeitem;
      let list = JSON.parse(JSON.stringify(this.phonelist));
      this.phonelist.forEach((item, index) => {
        if (item.phoneId == treeitem.phoneId) {
          list.splice(index, 1);
        }
      });
      groupconnection(list);
      let refsvideo = this.$refs.videoitem;
      let videoitem = this.getvideoitem(refsvideo, treeitem.phoneId);
      videoitem.clearstatus();
      this.showmodel = !this.showmodel;
    },
    // 关闭主控窗口并断开主控窗口连接
    closemodelcontrol() {
      console.log("closemodelcontrol start.");
      this.showmodel = !this.showmodel;
      let phoneId = this.modeldata.phoneId;
      groupconnection(this.phonelist, 500);
      let refsvideo = this.$refs.videoitem;
      let videoitem = this.getvideoitem(refsvideo, phoneId);
    },
    // 上传
    showuploadmodel() {
      this.showupload = !this.showupload;
    },
    // 关闭上传
    closeuploadmodel() {
      this.showupload = !this.showupload;
    },
    showconnectmodel() {
      this.showconnection = !this.showconnection;
    },
    closeconnectmodel() {
      this.showconnection = !this.showconnection;
    },
    showgpsmodel() {
      if (this.checkeditem && this.checkeditem.length) {
        this.showsetgps = !this.showsetgps;
      } else {
        this.$message.warning("请勾选需要操作的云手机");
      }
    },
    closegpsmodel() {
      this.showsetgps = !this.showsetgps;
    },
    showresolumodel() {
      if (this.checkeditem && this.checkeditem.length) {
        this.showresolu = !this.showresolu;
      } else {
        this.$message.warning("请勾选需要操作的云手机");
      }
    },
    closeresolumodel() {
      this.showresolu = !this.showresolu;
    },
    showresetmodel() {
      if (this.checkeditem && this.checkeditem.length) {
        this.showreset = !this.showreset;
      } else {
        this.$message.warning("请勾选需要操作的云手机");
      }
    },
    closeresetmodel() {
      this.showreset = !this.showreset;
    },
    showrootmodel() {
      if (this.phonelist && this.phonelist.length) {
        this.showroot = !this.showroot;
      } else {
        this.$message.warning("暂无可设置云手机");
      }
    },
    closerootmodel() {
      this.showroot = !this.showroot;
    },
    showdownloadmodel() {
      this.isdownloadshow = !this.isdownloadshow;
    },
    closedownloadmodel() {
      this.isdownloadshow = !this.isdownloadshow;
    },
    showprogressmodel() {
      this.isprogressshow = !this.isprogressshow;
    },
    closeprogressmodel() {
      this.isprogressshow = !this.isprogressshow;
    },
    //点击重启按钮
    ifallrestart() {
      if (this.checkeditem && this.checkeditem.length) {
        this.restarttitle = "重启过程需3-5分钟,确认重启吗?";
      } else {
        this.restarttitle = "请勾选需要操作的云手机。";
      }
    },
    //批量重启
    allrestart() {
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "RebootUPhone",
        UPhoneIds: [],
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      if (this.checkeditem && this.checkeditem.length) {
        this.checkeditem.forEach((item, index) => {
          data.UPhoneIds.push(item);
        });
        this.$request.post("?Action=RebootUPhone", data).then((res) => {
          if (res.RetCode == 0) {
            this.jobId = res.JobId;
            this.getUPhoneJob();
          } else {
            this.$message.error("重启失败！");
          }
        });
      } else {
        return;
      }
    },
    isallroot(isroot) {
      if (this.checkeditem && this.checkeditem.length) {
        this.roottitle = `${isroot}ROOT会重启云手机,确定一键ROOT吗？`;
      } else {
        this.roottitle = "请勾选需要操作的云手机";
      }
    },
    allroot(root) {
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "SetUPhoneRootMode",
        UPhoneIds: [],
        PkgNames: root ? ["\\*"] : [],
        Root: root,
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
      };
      if (this.checkeditem && this.checkeditem.length) {
        this.checkeditem.forEach((item, index) => {
          data.UPhoneIds.push(item);
        });
        this.$request.post("?Action=SetUPhoneRootMode", data).then((res) => {
          if (res.RetCode == 0) {
            this.jobId = res.JobId;
            this.getUPhoneJob();
          } else {
            this.$message.error("一键ROOT失败！");
          }
        });
      } else {
        return;
      }
    },
    isallnew() {
      if (this.checkeditem && this.checkeditem.length) {
        this.newtitle = "一键新机会重启云手机,确定一键新机吗？";
      } else {
        this.newtitle = "请勾选需要操作的云手机";
      }
    },
    allnew() {
      let data = {
        CityId: this.query.city_id,
        ProjectId: this.query.project_id,
        Action: "RenewUPhone",
        UPhoneIds: [],
        ProductType: this.$route.query.product_type
          ? this.$route.query.product_type
          : "uphone-server",
        Customize: false,
      };
      if (this.checkeditem && this.checkeditem.length) {
        this.checkeditem.forEach((item, index) => {
          data.UPhoneIds.push(item);
        });
        this.$request.post("?Action=RenewUPhone", data).then((res) => {
          if (res.RetCode == 0) {
            this.jobId = res.JobId;
            this.getUPhoneJob();
          } else {
            this.$message.error("一键新机失败！");
          }
        });
      } else {
        return;
      }
    },
    //重启未完成前不可操控云手机
    disabledcontrol(boolean) {
      this.controldisabled = boolean;
      this.treedata.forEach((item, index) => {
        this.$set(item, "disabled", boolean);
        item.children.forEach((eitem, eindex) => {
          this.$set(eitem, "disabled", boolean);
        });
      });
    },
    showprogress() {
      console.log("progress");
    },
    //获取重启进程
    getUPhoneJob(msg) {
      let successList = 0
      this.disabledcontrol(true);
      let list = [];
      this.phonelist.forEach((item) => {
        if (item.itemchecked == false) {
          list.push(item);
        }
      });
      groupconnection(list, 0, []);
      if (this.timmer !== null) {
        clearInterval(this.timmer);
      }
      var payload = {
        Action: "DescribeUPhoneJob",
        ProjectId: this.query.project_id,
        CityId: this.query.city_id,
        JobIds: [msg ? msg.jobId : this.jobId],
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
            if(res.Jobs[0].Tasks.length){

            }
            if (res.Jobs[0].State == "SUCCESS") {
              clearInterval(this.timmer);
              this.resetShowVideoList();
              groupconnection(this.phonelist, 0, this.showvideolist);
              this.disabledcontrol(false);
            }
            if (res.Jobs[0].State == "FAILED") {
              this.$message.error("重启失败！");
              clearInterval(this.timmer);
              this.resetShowVideoList();
              groupconnection(this.phonelist, 0, this.showvideolist);
              this.disabledcontrol(false);
            }
            if (res.Jobs[0].State == "PARTIAL_SUCCESS") {
              this.$message.error("重启失败！");
              clearInterval(this.timmer);
              this.resetShowVideoList();
              groupconnection(this.phonelist, 0, this.showvideolist);
              this.disabledcontrol(false);
            }
          });
      }, 5000);
    },
    //获取点击videoitem
    getvideoitem(videogroup, phoneId) {
      let selecteditem;
      videogroup.map((item) => {
        if (item.id == phoneId) {
          selecteditem = item;
        }
        return;
      });
      return selecteditem;
    },
    getfinnallist(oldlist, newlist) {
      let relist = [];
      let inlist = [];
      let finnallist = [];
      for (let i = 0; i < oldlist.length; i++) {
        let flag = false;
        for (let j = 0; j < newlist.length; j++) {
          if (oldlist[i].phoneId == newlist[j].phoneId) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          relist.push(oldlist[i]);
        }
      }
      for (let i = 0; i < newlist.length; i++) {
        let flag = false;
        for (let j = 0; j < oldlist.length; j++) {
          if (newlist[i].phoneId == oldlist[j].phoneId) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          if (this.checked == true) {
            newlist[i]["itemchecked"] = true;
          } else {
            newlist[i]["itemchecked"] = false;
          }
          inlist.push(newlist[i]);
        }
      }
      if (inlist.length) {
        finnallist = [...oldlist, ...inlist];
      }
      if (relist.length) {
        relist.forEach((ritem, rindex) => {
          oldlist.forEach((oitem, oindex) => {
            if (ritem.phoneId == oitem.phoneId) {
              oldlist.splice(oindex, 1);
            }
          });
        });
        finnallist = oldlist;
      }

      // console.log(finnallist);
      // console.log(relist);
      // console.log(inlist);
      return finnallist;
    },
    treecheck(click, checked) {
      // console.log(this.treedata)
      // if (this.controldisabled) {
      //   return;
      // }
      var checkedlist = this.$refs.tree.getCheckedNodes(false, true);
      this.prephonelist = [...this.phonelist];
      var oldphoneList = [...this.phonelist];
      var newphoneList = [];
      checkedlist.map((item, index) => {
        if (item.isLeaf == true) {
          newphoneList.push(item);
        }
      });
      // console.log(oldphoneList, newphoneList);
      this.phonelist = this.getfinnallist(oldphoneList, newphoneList);
      // console.log(this.phonelist);
      this.total = this.phonelist.length;
      if (this.checked == true) {
        this.checkednum = this.phonelist.length;
        this.checkeditem = this.phonelist.map((item) => {
          return item.phoneId;
        });
      }
      if (this.phonelist.length > this.pagesize) {
        this.filterlist(this.currentPage);
      } else {
        this.prevshowphonelist = this.showphonelist;
        this.showphonelist = this.phonelist;
      }

      this.showvideolist = [];
      for (let i = 0; i < this.phonelist.length; i++) {
        let phoneid = this.phonelist[i].phoneId;
        let pitem = null;
        if (this.existid(this.prephonelist, phoneid)) {
          //已经连接
          if (this.existid(this.prevshowphonelist, phoneid)) {
            if (this.existid(this.showphonelist, phoneid)) {
              pitem = { [phoneid]: "stos" };
            } else {
              pitem = { [phoneid]: "stoh" };
            }
          } else {
            if (this.existid(this.showphonelist, phoneid)) {
              pitem = { [phoneid]: "htos" };
            } else {
              pitem = { [phoneid]: "htoh" };
            }
          }
        } else {
          //未连接
          if (this.existid(this.showphonelist, phoneid)) {
            pitem = { [phoneid]: "ntos" };
          } else {
            pitem = { [phoneid]: "ntoh" }; //从无到显示
          }
        }
        this.showvideolist.push(pitem);
      }
      console.log(
        "treecheck showvideolist: " + JSON.stringify(this.showvideolist)
      );
      groupconnection(this.phonelist, 0, this.showvideolist);
    },
    filterlist(i) {
      if (
        this.showphonelist.length == 1 &&
        this.phonelist.length < this.prephonelist.length
      ) {
        let startindex = (i - 2) * this.pagesize;
        let endindex = (i - 1) * this.pagesize;
        this.prevshowphonelist = this.showphonelist;
        this.showphonelist = this.phonelist.slice(startindex, endindex);
        this.currentPage = i - 1;
        return;
      }
      let startindex = (i - 1) * this.pagesize;
      let endindex = i * this.pagesize;
      this.prevshowphonelist = this.showphonelist;
      this.showphonelist = this.phonelist.slice(startindex, endindex);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.filterlist(1);
      this.currentPage = 1;
      if (val == 4) {
        this.$store.commit("setTime", 3000);
      }
      if (val == 6) {
        this.$store.commit("setTime", 4000);
      }
      if (val == 8) {
        this.$store.commit("setTime", 5000);
      }
      if (val == 12) {
        this.$store.commit("setTime", 7000);
      }
      if (val == 24) {
        this.$store.commit("setTime", 15000);
      }
      if (val == 48) {
        this.$store.commit("setTime", 15000);
      }
      this.checkShowVideo();
    },
    handleCurrentChange(current) {
      this.filterlist(current);
      this.currentPage = current;
      this.checkShowVideo();
    },
    checkShowVideo() {
      this.showvideolist = [];
      for (let i = 0; i < this.phonelist.length; i++) {
        let pitem = null;
        let phoneid = this.phonelist[i].phoneId;
        if (this.existid(this.showphonelist, phoneid)) {
          if (this.existid(this.prevshowphonelist, phoneid)) {
            pitem = { [phoneid]: "stos" }; //从显示到显示
          } else {
            pitem = { [phoneid]: "htos" }; //从隐藏到显示
          }
        } else {
          if (this.existid(this.prevshowphonelist, phoneid)) {
            pitem = { [phoneid]: "stoh" }; //从显示到隐藏
          } else {
            pitem = { [phoneid]: "htoh" }; //从隐藏到隐藏
          }
        }
        this.showvideolist.push(pitem);
      }
      console.log(JSON.stringify(this.showvideolist));
      groupconnection(this.phonelist, 0, this.showvideolist);
    },
    existid(list, id) {
      let find = false;
      for (let j = 0; j < list.length; j++) {
        if (id == list[j].phoneId) {
          find = true;
          break;
        }
      }
      return find;
    },
    resetShowVideoList() {
      // console.log("before: " + JSON.stringify(this.showvideolist));
      var svList = [];
      for (let i = 0; i < this.showvideolist.length; i++) {
        var key = Object.keys(this.showvideolist[i]);
        var showflag = Object.values(this.showvideolist[i]);
        for (let j = 0; j < this.checkeditem.length; j++) {
          if (this.checkeditem[j] == key) {
            if (showflag == "stos" || showflag == "htos") {
              showflag = "ntos";
            }
            if (showflag == "stoh" || showflag == "htoh") {
              showflag = "ntoh";
            }
          }
        }
        let pitem = { [key]: showflag };
        svList.push(pitem);
      }
      this.showvideolist = svList;
      console.log("after: " + JSON.stringify(this.showvideolist));
    },
  },
};
</script>

<style lang="scss">
.el-dialog {
  border-radius: 4px;
}
* {
  margin: 0;
  padding: 0;
}
.notify {
  font-size: 14px;
  color: #000;
  span {
    font-weight: 800;
    color: rgb(56, 96, 244);
    margin-right: 5px;
  }
}
#wrap {
  width: 100vw;
  height: 100vh;
  min-width: 1280px;
  min-height: 720px;
  overflow-x: auto;
  box-sizing: border-box;
  display: flex;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  border-color: rgb(56, 96, 244);
  background: rgb(56, 96, 244);
}
.el-checkbox__inner:hover {
  border-color: rgb(56, 96, 244);
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: rgb(56, 96, 244) !important;
}
.el-switch.is-checked .el-switch__core {
  border-color: rgb(56, 96, 244);
  background: rgb(56, 96, 244);
}
.el-switch__label.is-active {
  color: rgb(56, 96, 244) !important;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-button--text {
  color: #000;
  font-size: 14px;
}
.lefttree {
  box-sizing: border-box;
  width: 400px;
  height: 100%;
  overflow: auto;
  padding: 20px 20px;
  border-right: 1px solid #ecf5ff;
  transition: 0.2s;
  .lefttitle {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    .title {
      display: inline-block;
      font-size: 14px;
      color: rgb(10, 22, 51);
      .iconcolor {
        color: rgb(56, 96, 244);
      }
    }
    .fold {
      cursor: pointer;
      display: inline-block;
      font-size: 18px;
      margin-top: -1px;
    }
  }
  .unfoldpre {
    display: none;
  }
  .unfold {
    cursor: pointer;
    display: inline-block;
    display: block;
    font-size: 18px;
    margin-top: 18px;
    text-align: center;
    color: rgb(56, 96, 244);
  }
}
.foldlefttree {
  box-sizing: border-box;
  width: 30px;
  height: 100%;
  overflow-x: auto;
  padding: 0;
  border-right: 1px solid #ecf5ff;
  .foldlefttitle {
    display: none;
  }
  .eltree {
    display: none;
  }
}
.level1 {
  font-size: 13px;
}
.level2 {
  flex: 1;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#groupview {
  flex: 1;
  // width: calc(100% - 300px);
  height: 100%;
  // overflow: auto;
  position: relative;
  .group-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    min-height: 60px;
    // background: lavenderblush;
    box-sizing: border-box;
    position: absolute;
    line-height: 60px;
    padding: 0px 20px;
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
  }

  .groupbottom4 {
    height: calc(100% - 110px);
    background: linear-gradient(rgb(235, 237, 245) 0%, rgb(235, 237, 245) 100%);
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    grid-template-rows: 100%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    margin-top: 60px;
  }
  .groupbottom6 {
    height: calc(100% - 110px);
    background: linear-gradient(rgb(235, 237, 245) 0%, rgb(235, 237, 245) 100%);
    display: grid;
    grid-template-columns: 33.3% 33.3% 33.3%;
    grid-template-rows: 50% 50%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    margin-top: 60px;
  }
  .groupbottom8 {
    height: calc(100% - 110px);
    background: linear-gradient(rgb(235, 237, 245) 0%, rgb(235, 237, 245) 100%);
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    grid-template-rows: 50% 50%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    margin-top: 60px;
  }
  .groupbottom12 {
    height: calc(100% - 110px);
    background: linear-gradient(rgb(235, 237, 245) 0%, rgb(235, 237, 245) 100%);
    display: grid;
    grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
    grid-template-rows: 50% 50%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    margin-top: 60px;
  }
  .groupbottom24 {
    height: calc(100% - 110px);
    background: linear-gradient(rgb(235, 237, 245) 0%, rgb(235, 237, 245) 100%);
    display: grid;
    grid-template-columns: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
    grid-template-rows: 25% 25% 25% 25%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    margin-top: 60px;
  }
  .groupbottom48 {
    height: calc(100% - 110px);
    background: linear-gradient(rgb(235, 237, 245) 0%, rgb(235, 237, 245) 100%);
    display: grid;
    grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
    grid-template-rows: 16.6% 16.6% 16.6% 16.6% 16.6% 16.6%;
    align-items: center;
    justify-items: center;
    overflow: auto;
    margin-top: 60px;
  }
  .bottom-page {
    width: 100%;
    height: 50px;
    position: relative;
  }
  .selectcount {
    position: absolute;
    font-size: 14px;
    top: 16px;
    left: 20px;
    span {
      color: rgb(56, 96, 244);
    }
  }
  .progresscount {
    position: absolute;
    cursor: pointer;
    font-size: 14px;
    top: 16px;
    left: 140px;
    color: rgb(56, 96, 244);
  }
  .el-pagination {
    position: absolute;
    top: 8px;
    right: 10px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(246, 246, 251); // 进行修改选中项背景和字体
    color: rgb(56, 96, 244);
  }

  .vcontain4 {
    width: 70%;
    height: 50%;
  }
  .vcontain6 {
    width: 50%;
    height: 80%;
  }
  .vcontain8 {
    width: 70%;
    height: 80%;
  }
  .vcontain12 {
    width: 80%;
    height: 80%;
  }
  .vcontain24 {
    width: 60%;
    height: 80%;
  }
  .vcontain48 {
    width: 50%;
    height: 80%;
  }
  .videoitem {
    height: calc(100% - 20px);
    width: 100%;
  }
}
</style>
