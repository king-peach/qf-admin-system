<template>
  <el-form :inline="true" :data="formData" class="box">
    <el-form-item v-for="(item, key) in formData" :key="key" :label="item.label">
      <el-input v-model="item.value" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="medium" icon="el-icon-search" @click="submit" round>搜 索</el-button>
      <el-button size="medium" icon="el-icon-refresh" @click="reset" round>重 置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    formData: {
      required: true,
      type: Object
    }
  },
  methods: {
    submit() {
      const searchForm = new Object
      for (const i in this.formData) {
        Object.defineProperty(searchForm, i, {
          value: this.formData[i].value
        })
      }
      this.$emit('search', searchForm)
    },
    reset() {
      for (const i in this.formData) {
        this.formData[i].value = ''
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.box {
  padding: 20px 0 0 20px;
  margin-bottom: 20px;
  -webkit-box-shadow: 1px 1px 2px 2px #ddd;
  box-shadow: 1px 1px 2px 2px #ddd;
  @media screen and (max-width: 800px) {
    display: none;
  }
}
</style>
