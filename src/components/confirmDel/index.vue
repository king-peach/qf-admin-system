<template>
  <el-dialog :visible.sync="delUserVisible" :show="show" title="提示" center @close="$emit('update:show', false)">
    <div class="del-dialog-cnt">删除不可恢复，是否确定删除</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="delUserVisible = false">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
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
      delUserVisible: this.show
    }
  },
  watch: {
    show() {
      this.delUserVisible = this.show
    }
  },
  methods: {
    confirm() {
      this.$emit('confirmDel')
    }
  }
}
</script>
