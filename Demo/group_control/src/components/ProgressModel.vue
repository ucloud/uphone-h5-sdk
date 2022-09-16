<template>
  <el-dialog
    :visible.sync="showprogress"
    :before-close="closemodel"
    class="progress-eldialog"
  >
    <el-table style="width:100%"  :data="tabledata">
      <el-table-column prop="id" label="序号" width="50"> </el-table-column>
      <el-table-column prop="resourceId" label="资源ID" width="120">
      </el-table-column>
      <el-table-column prop="jobType" label="任务名称" width="120">
      </el-table-column>
      <el-table-column prop="begainTime" label="开始时间" width="150">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180">
      </el-table-column>
      <el-table-column prop="jobStatus" label="任务状态" width="180">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: ["showprogress"],
  data() {
    var data = {
      id: 1,
      resourceId: "123",
      jobType: "批量重启",
      begainTime: "2022-7-22 9:00",
      endTime: "2022-7-22 9:10",
      jobStatus: "进行中",
    };
    return {
      tabledata: [data],
    };
  },
  methods: {
    closemodel() {
      this.$emit("closeprogressmodel");
    },
  },
};
</script>
<style lang="scss" >
.progress-eldialog {
  .el-dialog {
    width: 850px;
    max-height: 600px;
  }
}
</style>