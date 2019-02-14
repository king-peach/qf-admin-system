<template>
  <el-dialog :visible.sync="delVisible" :show="show" title="提示" center @close="$emit('update:show', false)">
    <div class="del-dialog-cnt">删除不可恢复，是否确定删除</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="delVisible = false">取消</el-button>
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
    },
    type: {
      type: String,
      default: 'delOne'
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
      if (this.type !== 'delOne') {
        this.$emit(this.type === 'clear' ? 'confirmClear' : 'confirmDelMore')
        return false
      }
      this.$emit('confirmDelOne')
    }
  }
}
</script>
