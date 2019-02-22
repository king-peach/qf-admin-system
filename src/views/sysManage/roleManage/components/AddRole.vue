<template>
  <el-dialog :visible.sync="addRoleVisible" :show="show" :title="isCreate === true ? '新增角色' : '编辑角色'" center @close="cancelAdd('ruleForm')">
    <el-form :label-position="labelPosition" :rules="rules" ref="ruleForm" :model="role" label-width="100px" label-suffix=":" style="padding: 0 20px;">
      <el-form-item label="角色代码" prop="roleKey">
        <el-input v-model="role.roleKey" />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="role.status" />
      </el-form-item>
      <el-form-item label="上级主管" prop="leader">
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
          <el-input v-model="role.leader" slot="reference"/>
        </el-popover>
      </el-form-item>
      <el-form-item label="角色排序" prop="roleSort">
        <el-input v-model.number="role.roleSort" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="role.remark"/>
      </el-form-item>
      <div align="center">
        <el-button @click="cancelAdd('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    role: {
      type: Object,
      required: true
    },
    isCreate: {
      type: Boolean,
      default: true
    },
    treeData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      labelPosition: 'right', // 新增表单的位置
      addRoleVisible: this.show,
      parentVisible: false, // 部门列表开关
      parentDepart: '', // 存放选取上级部门值
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      rules: {
        roleKey: [
          { required: true, message: '请输入角色代码', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        roleSort: [
          { required: true, message: '请输入角色排序', trigger: ['blur'] },
          { type: 'number', message: '请输入数字类型的角色排序', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show() {
      this.addRoleVisible = this.show
    }
  },
  methods: {
    onSubmit(formName) { // 确定新增/编辑角色
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const roles = { ...this.role }
          this.isCreate === true ? this.$emit('confirmAdd', roles) : this.$emit('confirmEdit', roles)
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancelAdd(formName) { // 取消新增/编辑角色
      this.$refs[formName].resetFields()
      this.$emit('cancel')
    },
    handleNodeClick(data) { // 树节点被选择时回调
      this.parentDepart = data.deptName
    },
    selected() { // 确定选择上级机构函数
      this.role.leader = this.parentDepart
      this.parentVisible = false
    }
  }
}
</script>
