<template>
  <el-dialog
    class="ifconnect"
    :visible.sync="showconnection"
    @open="open"
    :before-close="closemodel"
  >
    <div slot="title" class="dialog-title">
      <span>系统提示</span>
    </div>
    <div>
      <p>
        开启同步操作，则操作任意一台云手机，会将操作同步至本组中已勾选的云手机！
      </p>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        class="confirmbtn"
        size="mini"
        @click="closemodel"
        type="primary"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ["showconnection","content"],
  data() {
    return {};
  },
  methods: {
    open() {},
    closemodel() {
      this.$emit("closeconnectmodel");
    },
  },
};
</script>
<style lang="scss">
.ifconnect {
  .dialog-title {
    height: 53px;
    border-bottom: 1px solid rgb(195, 202, 217);
    box-sizing: border-box;
    padding: 16px;
  }
  .dialog-footer {
    height: 53px;
    padding: 15px 16px;
    box-sizing: border-box;
    border-top: 1px solid rgb(195, 202, 217);
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
    width: 374px;
    height: 214px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__footer {
    padding: 0;
  }
}
</style>>
