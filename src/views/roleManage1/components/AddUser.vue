<template>
  <el-dialog :visible.sync="addUserVisible" :show="show" :append-to-body="true" title="用户列表" center @close="$emit('update:show', false)">
    <el-table ref="currentTable" :data="user" highlight-current-row @current-change="checkBox" @selection-change="selectUser">
      <el-table-column type="index" />
      <el-table-column type="selection" />
      <el-table-column label="用户名" prop="username" align="center" />
      <el-table-column label="真实姓名" prop="name" align="center" />
      <el-table-column label="用户状态" prop="status" align="center" />
      <el-table-column label="邮箱" prop="email" />
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addUserVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    user: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addUserVisible: this.show, // 保存show值
      multipleAdd: [] // 存储添加用户数据
    }
  },
  watch: {
    show() { // show值改变时，addUserVisible也对应改变
      this.addUserVisible = this.show
    }
  },
  methods: {
    checkBox(row) {
      this.$refs.currentTable.toggleRowSelection(row)
      // 触发当前行改变函数
    },
    selectUser(val) {
      this.multipleAdd = val
      console.log(this.multipleAdd)
    },
    confirm() {
      this.$emit('confirmAdd', this.multipleAdd)
      this.multipleAdd = [] // 点击确定按钮后，清空选中的用户数据
    }
  }
}
</script>
