<template>
  <el-dialog :visible.sync="editPasswordVisible" :show="show" title="修改密码" center @close="cancel('editPassForm')">
    <el-form :model="user" status-icon :rules="rule" ref="editPassForm" label-width="100px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="user.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="原始密码" prop="oldPassword" autocomplete="off">
        <el-input v-model.trim="user.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" autocomplete="off">
        <el-input v-model.trim="user.newPassword"></el-input>
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
    },
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    // 表单校验规则
    const validateOldPassword = (rule, value, callback) => {
      let regUsername = /^\w{4,15}$/
      if (value === '') {
        callback(new Error('请输入原始密码'))
      } else {
        if (this.user.newPassword !== '') {
          this.$refs.editPassForm.validateField('newPassword')
        }
        // if (valid != this.user.userPassword) {
        //   callback(new Error('原始密码错误！'))
        // }
        regUsername.test(value) === true ? callback() : callback(new Error('请输入含有字母、数字或下划线的4-16位原始密码'))  
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      let regValidate = /^\w{4,15}$/
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.user.oldPassword) {
        callback(new Error('新密码与原始密码不能相同'))
      } else {
        regValidate.test(this.user.newPassword) ? callback() : callback(new Error('请输入含有字母、数字或下划线的4-16位新密码'))
      }
    }
    return {
      rule: {
        oldPassword: [
          { validator: validateOldPassword, trigger: blur }
        ],
        newPassword: [
          { validator: validateNewPassword, trigger: blur }
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
          const newData = { ...this.user }
          this.$emit('confirmEdit', newData)
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
