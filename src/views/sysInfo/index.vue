<template>
  <div class="main">
    <div class="title">
      <el-button type="warning">禁止登陆</el-button>
      <el-button type="danger">强制注销所有会话</el-button>
    </div>
    <el-collapse v-model="activeName" :data="list" accordion>
      <!-- 遍历取到的数据，进行数据绑定 -->
      <template v-for="(value,index) in list">
        <el-collapse-item :title="key[index]" :key="index">
          <el-table :data="value" style="width:100%">
            <el-table-column prop="name" label="数据项" min-width="500" />
            <el-table-column prop="value" label="值" min-width="500" />
          </el-table>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script>
import { getInfo } from '@/api/sysInfo'
export default {
  data() {
    return {
      activeName: '',
      list: [],
      key: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getInfo().then(response => {
        for (const i in response.data) {
          this.list.push(response.data[i]) // 将返回的对象转化成数组
        }
        this.key = Object.keys(response.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .title{
    padding-bottom:20px;
  }
</style>
