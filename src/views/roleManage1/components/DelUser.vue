<template>
  <el-dialog :visible.sync="delVisible" :show="show" :append-to-body="true" title="提示" center @close="cancel" >
    <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm" >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      delVisible: this.show
    }
  },
  watch: {
    show() {
      this.delVisible = this.show
    }
  },
  methods: {
    confirm() {
      this.$emit('confirmDel')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
