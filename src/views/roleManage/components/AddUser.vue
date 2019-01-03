<template>
  <el-dialog :visible.sync="addUserVisible" :disabled="disabled" title="用户列表" append-to-body fullscreen @close="cancel">
    <el-table
      ref="userChecked"
      :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      highlight-current-row
      stripe
      @row-click="clickBox"
      @selection-change="selectedRow">
      <el-table-column type="index"/>
      <el-table-column type="selection" />
      <el-table-column label="用户名" prop="username" align="center" />
      <el-table-column label="真实姓名" prop="name" align="center" />
      <el-table-column label="所属机构" prop="group" align="center" />
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <i :class="['icon', scope.row.status? 'iconTrue' : 'iconFalse']" />
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" align="center" />
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addUserVisible = false">取消</el-button>
      <el-button type="primary" @click="add">添加</el-button>
    </span>
    <!-- 分页器 -->
    <el-pagination
      :page-size="pageSize"
      :total="userList.length"
      small
      layout="total, prev, pager, next, jumper"
      class="pagination-style"
      @current-change="getCurrentChange"
      @size-change="getSize" />
  </el-dialog>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      addUserVisible: this.disabled,
      userList: [
        { username: 'admin1', name: '管理员1', group: '总公司', status: true, email: 'www.ddada@163.com' },
        { username: 'admin2', name: '管理员2', group: '分公司', status: false, email: 'www.ddada@163.com' },
        { username: 'admin3', name: '管理员3', group: '总公司', status: true, email: 'www.ddada@163.com' },
        { username: 'admin4', name: '管理员4', group: '分公司', status: false, email: 'www.ddada@163.com' },
        { username: 'admin5', name: '管理员5', group: '总公司', status: true, email: 'www.ddada@163.com' },
        { username: 'admin6', name: '管理员6', group: '分公司', status: false, email: 'www.ddada@163.com' },
        { username: 'admin7', name: '管理员7', group: '总公司', status: true, email: 'www.ddada@163.com' },
        { username: 'admin8', name: '管理员8', group: '总公司', status: false, email: 'www.ddada@163.com' }
      ],
      pageSize: 5,
      currentPage: 1,
      multiopleRow: []
    }
  },
  watch: {
    disabled() {
      this.addUserVisible = this.disabled
    }
  },
  methods: {
    clickBox(row) {
      this.$refs.userChecked.toggleRowSelection(row)
    },
    add() {
      this.$emit('addSuccess')
    },
    cancel() {
      this.$emit('cancelAdd')
    },
    getSize(size) { // pageSize改变时获取pageSize
      this.pageSize = size
    },
    getCurrentChange(val) { // 当前页码改变时获取当前页码
      this.currentPage = val
    },
    selectedRow(val) { // 选中的选项
      this.multiopleRow = []
      for (const i of val) {
        this.multiopleRow.push(i.name)
      }
      console.log(this.multiopleRow)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-style{
  margin-top: 3%;
  text-align: center;
}
.icon{
  display: inline-block;
  height: 30px;
  width: 30px;
}
.iconTrue{
  background: url('~@/assets/userManage_images/true.png') center center no-repeat;
  background-size: cover;
}
.iconFalse{
  background: url('~@/assets/userManage_images/stop.png') center center no-repeat;
  background-size: cover;
}
</style>
