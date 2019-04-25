<template>
  <el-dialog :visible.sync="infoVisible" :title="flag === 0 ? '编辑目录' : flag === 1 ? '编辑菜单' : '编辑按钮'" center @close="cancel">
    <el-form :data="formData" label-width="100px" label-suffix=":">
      <el-form-item label="上级菜单" disabled>
        <el-input v-model="formData.parentId" disabled />
      </el-form-item>
      <el-form-item :label="flag === 0 ? '目录名称' : flag === 1 ? '菜单名称' : '按钮名称'">
        <el-input v-model="formData.menuName" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="formData.orderNum" disabled />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formData.status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: right">
        <template slot-scope="">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="confirm">确定</el-button>
        </template>
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
    flag: {
      type: Number,
      default: 1
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      infoVisible: this.show,
      options: [{
        value: 1,
        label: '启用'
      }, {
        value: 0,
        label: '禁用'
      }]
    }
  },
  watch: {
    show() {
      this.infoVisible = this.show
    }
  },
  methods: {
    cancel() { // 取消新增/编辑
      this.$emit('cancel')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

