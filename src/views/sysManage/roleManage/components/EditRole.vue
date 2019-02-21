<template>
  <el-dialog :visible.sync="editRoleVisible" :show="show" title="角色列表" @close="cancelEdit('roleForm')">
    <!-- <el-table :data="user.slice((currentPage-1)*pageSize,currentPage*pageSize)" highlight-current-row>
      <el-table-column label="角色ID" prop="roleId" align="center" />
      <el-table-column label="角色名称" prop="roleName" align="center" />
      <el-table-column label="上级主管" prop="createBy" align="center" />
      <el-table-column label="状态" prop="status" align="center" />
      <el-table-column label="创建时间" prop="createBy" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="medium" style="color: #f56c6c;" @click="delUser(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editRoleVisible = false">取 消</el-button>
      <el-button @click="addUser">添加用户</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span> -->
    <!-- 分页器 -->
    <!-- <el-pagination
      :page-size="pageSize"
      :total="user.length"
      small
      layout="total, prev, pager, next, jumper"
      @current-change="getCurrentPage"
      @size-change="getPageSize" /> -->
    <!-- 用户列表 -->
    <!-- <add-user :disabled="addUserVisible" @addSuccess="confirmAdd" @cancelAdd="cancel" /> -->
    <el-form ref="roleForm" :rules="rule" :model="role" label-width="100px" label-suffix=":" style="padding: 0 20px;">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" />
      </el-form-item>
      <el-form-item label="角色字段" prop="roleKey">
        <el-input v-model="role.roleKey" />
      </el-form-item>
      <el-form-item label="上级主管" prop="updateBy">
        <el-popover
          placement="bottom"
          v-model="parentVisible"
          title="部门列表"
          visible-arrow
          width="400">
          <el-tree :data="treeData" :props="defaultProps" accordion @node-click="handleNodeClick"/>
          <div align="right" style="margin-top: 1em">
            <el-button size="mini" @click="parentVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="selected">确定</el-button>
          </div>
          <el-input v-model="role.createBy" slot="reference" class="parent-department"/>
        </el-popover>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="role.status" />
      </el-form-item>
      <el-form-item label="角色排序" prop="roleSort">
        <el-input v-model.number="role.roleSort" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="role.remark" />
      </el-form-item>
      <div align="center" style="padding-top: 10px;">
        <el-button @click="cancelEdit('roleForm')">取消</el-button>
        <el-button type="primary" @click="confirm('roleForm')">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
// import { Message } from 'element-ui'
// import AddUser from './AddUser'
export default {
  // components: {
  //   AddUser
  // },
  props: {
    role: {
      type: Object,
      require: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editRoleVisible: this.show, // 保存show值
      parentVisible: false, // 部门列表开关
      parentDepart: '', // 存放选取上级部门值
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      rule: {
        roleName: [
          { require: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleKey: [
          { require: true, message: '请输入角色字段', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '请输入角色排序', trigger: ['blur', 'change'] },
          { type: 'number', message: '请输入数字类型的角色排序', trigger: 'blur' }
        ]
      },
      treeData: [{
        name: '总公司',
        leader: '系统管理员',
        fax: '0730-12344',
        tel: '13517302233',
        children: [
          {
            name: '七风网络',
            leader: '管理员',
            fax: '0731-22222',
            tel: '18723124442',
            children: [
              {
                name: '运营部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '技术部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '商务部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '编辑部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '财务部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }
            ]
          }
        ]
      }]
      // addUserVisible: false, // 用户列表开关
      // pageSize: 5, // 单页包含元素数量
      // currentPage: 1 // 当前页码
    }
  },
  watch: {
    show() { // show值改变时，editRoleVisible也对应改变
      this.editRoleVisible = this.show
    }
  },
  methods: {
    confirm(formName) { // 编辑完点击确认
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const editRoles = { ...this.role }
          this.$emit('confirmEdit', editRoles)
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
      // this.multipleAdd = [] // 点击确定按钮后，清空选中的用户数据
    },
    cancelEdit(formName) { // 取消编辑
      this.$emit('cancel')
      this.$refs[formName].resetFields()
    },
    handleNodeClick(data) { // 树节点被选择时回调
      this.parentDepart = data.name
    },
    selected() {
      this.role.createBy = this.parentDepart
      this.parentVisible = false
    }
    // delUser(index) { // 删除用户
    //   this.user.splice(index, 1)
    //   Message({
    //     type: 'info',
    //     message: '删除成功'
    //   })
    // },
    // addUser() { // 添加用户开关
    //   this.addUserVisible = true
    // },
    // confirmAdd() { // 确认添加用户操作
    //   this.addUserVisible = false
    //   Message({
    //     type: 'info',
    //     message: '添加用户成功'
    //   })
    // },
    // cancel() { // 取消添加用户
    //   this.addUserVisible = false
    // },
    // getPageSize(size) { // pageSize改变时触发的回调
    //   this.pageSize = size
    // },
    // getCurrentPage(val) { // currentPage改变时触发的回调
    //   this.currentPage = val
    // }
  }
}
</script>
