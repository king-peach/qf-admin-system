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
        label: 'name'
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
      this.parentDepart = data.name
    },
    selected() { // 确定选择上级机构函数
      this.role.createBy = this.parentDepart
      this.parentVisible = false
    }
  }
}
</script>
