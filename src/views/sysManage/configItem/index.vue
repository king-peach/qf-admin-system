<template>
  <div class="main">
    <el-card v-for="(item, key) in data" :key="key" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ key }}</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">保存</el-button> -->
      </div>
      <el-form :label-position="labelPosition">
        <el-form-item v-for="(value, key) of item" :key="key" :label="key" :label-width="formLabelWidth" class="text item">
          <el-input v-model="item[key]" autocomplete="off" />
        </el-form-item>
        <el-form-item align="right">
          <el-button size="small" type="primary" @click="submitForm(item, key)">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{ '列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
import { getConfigMsg } from '@/api/sysManage/configItem'
export default {
  data() {
    return {
      labelPosition: 'left',
      data: [],
      formLabelWidth: '100px'
    }
  },
  created() { // 先请求数据，获取列表信息，渲染行数
    getConfigMsg().then(response => {
      // 利用map将后台返回字段名映射到中文字段名
      const data = response.data.map(function(item) {
        return {
          创建用户: item.createBy,
          创建时间: item.createTime,
          备注: item.remark,
          更新用户: item.updateBy,
          更新时间: item.updateTime,
          配置关键字段: item.configKey,
          配置项: item.configName,
          配置类型: item.configType,
          配置值: item.configValue,
          模版ID: item.moduleId
        }
      })
      for (const i in data) {
        this.data.push(data[i])
      }
    })
  },
  methods: {
    submitForm(value, key) {
      console.info(value, key)
      const updateBy = value['更新用户']
      console.info(updateBy)
    }
  }
}
</script>

<style lang="scss" scoped>
  // 卡片样式
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 10px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 31%;
    min-width: 400px;
    display: inline-block;
    margin: 0 2em 2em 0;
    @media screen and (max-width: 1600px) {
      width: 45%;
      &:nth-child(2n) {
        margin-left: 0;
      }
    }
    @media screen and (max-width: 1150px) {
      width: 100%;
      margin-right: 0;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
</style>
