<template>
  <el-dialog :visible.sync="editPasswordVisible" :show="show" title="修改密码" center @close="cancel('editPassForm')">
    <el-form :model="user" status-icon :rules="rule" ref="editPassForm" label-width="100px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="user.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="原始密码" prop="oldPass" autocomplete="off">
        <el-input v-model.trim="user.oldPass"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPass" autocomplete="off">
        <el-input v-model.trim="user.newPass"></el-input>
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="cancel('editPassForm')">取消</el-button>
        <el-button type="primary" @click="onSubmit('editPassForm')">确定</el-button>
      </el-form-item>
    </el-form>
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
    // 表单校验规则
    const validateOldPass = (rule, value, callback) => {
      let regUsername = /^\w{4,15}$/
      if (value === '') {
        callback(new Error('请输入原始密码'))
      } else {
        if (this.user.newPass !== '') {
          this.$refs.editPassForm.validateField('newPass')
        } 
        console.log(regUsername.test(value))
        regUsername.test(value) === true ? callback() : callback(new Error('请输入由字母数字和下划线组成的4-16位原始密码'))  
      }
    }
    const validateNewPass = (rule, value, callback) => {
      let regValidate = /^\w{4,15}$/
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.user.oldPass) {
        callback(new Error('新密码与原始密码不能相同'))
      } else {
        regValidate.test(this.user.newPass) ? callback() : callback(new Error('请输入由字母、数字、下划线组成的4-16位新密码'))
      }
    }
    return {
      user: { name: 'admin', oldPass: '', newPass: '' },
      rule: {
        oldPass: [
          { validator: validateOldPass, trigger: blur }
        ],
        newPass: [
          { validator: validateNewPass, trigger: blur }
        ]
      },
      editPasswordVisible: this.show
    }
  },
  watch: {
    show() {
      this.editPasswordVisible = this.show
    }
  },
  methods: {
     onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('confirmEdit')
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.$emit('cancelEdit')
      this.$refs[formName].resetFields()
    }
  }
}
</script>
