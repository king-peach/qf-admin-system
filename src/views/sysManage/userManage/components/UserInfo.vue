<template>
  <el-dialog :visible.sync="userinfoVisible" :show="show" :title="flag ? '新建用户' : '编辑用户'" center @close="cancel('ruleForm')">
    <el-form :model="formData" :rules="rule" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" :disabled="!flag" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="formData.realName" />
      </el-form-item>
      <el-form-item label="密码" :prop="flag ? 'password' : ''" v-show="flag">
        <el-input v-model="formData.password" />
      </el-form-item>
      <el-form-item label="重复密码" :prop="flag ? 'repeatPass' : ''" v-show="flag">
        <el-input v-model="formData.repeatPass" />
      </el-form-item>
      <el-form-item label="所属部门ID" prop="deptId">
        <el-popover
          placement="bottom-end"
          width="400"
          v-model="parentVisible"
          title="部门列表"
          visible-arrow>
          <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
          <div align="right" style="margin-top: 1em">
            <el-button size="mini" @click="parentVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="selected">确定</el-button>
          </div>
          <el-input v-model="formData.deptId" slot="reference"  />
        </el-popover>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-switch v-model="formData.status" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="所属角色" prop="roleIds">
        <el-select v-model="formData.roleIds" multiple placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.roleName"
            :value="item.roleId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" />
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="cancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    flag: { // 编辑/新增功能标识
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true
    },
    treeData: {
      type: Array,
      required: true
    },
    options: {
      tyep: Array,
      required: true
    }
  },
  data() {
    const validUsername = (rule, value, callback) => {
      const regUsername = /^[_a-zA-Z0-9]{4,15}$/

      !value ? callback(new Error('用户名不能为空')) : regUsername.test(value) ? callback() : callback(new Error('请输入含有字母、数字或下划线的4-16用户名'))
    }
    const validPassword = (rule, value, callback) => {
      const regPassword = /^[_a-zA-Z0-9]+$/

      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      this.formData.password !== '' ? this.$refs.ruleForm.validateField('repeatPass') : true
      regPassword.test(value) ? callback() : callback(new Error('请输入含有字母、数组或下划线的密码'))
    }
    const validRepeatPass = (rule, value, callback) => {
      !value ? callback(new Error('重复密码不能为空')) : value = this.formData.repeatPass ? callback() : callback(new Error('请保持重复密码与上一条密码一致'))
    }
    const validEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/

      !value ? callback(new Error('邮箱不能为空')) : regEmail.test(value) ? callback() : callback(new Error('请填写正确的邮箱'))
    }
    const validPhone = (rule, value, callback) => {
      const regPhone = /^[1][3,4,5,7,8]\d{9}$/

      !value ? callback(new Error('手机号不能为空')) : regPhone.test(value) ? callback() : callback(new Error('请填写正确的手机'))
    }
    return {
      userinfoVisible: this.show,
      parentVisible: false,
      parentDepart: {
        deptName: '',
        deptId: 1
      },
      title: '用户信息',
      rule: {
        username: [
          { validator: validUsername, trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请填写真实姓名', trigger: 'blur' }
        ],
        password: [
          { validator: validPassword, trigger: 'blur' },
          { min: 6, message: '密码至少六位', trriger: 'blur' }
        ],
        repeatPass: [
          { validator: validRepeatPass, trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        email: [
          { validator: validEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: validPhone, trigger: 'blur' }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'deptName'
      }
    }
  },
  watch: {
    show() {
      this.userinfoVisible = this.show
    }
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newFormData = { ...this.formData }
          this.flag === true ? this.$emit('confirmAdd', newFormData) : this.$emit('confirmEdit', newFormData)
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.$emit('closeDialog')
      this.$refs[formName].resetFields()
    },
    handleNodeClick(data) { // 树节点被选择时回调
      this.parentDepart.deptName = data.deptName
      this.parentDepart.deptId = data.deptId
    },
    selected() {
      this.parentVisible = false
      this.formData.deptId = this.parentDepart.deptId
      this.formData.deptName = this.parentDepart.deptName
    }
  }
}
</script>
