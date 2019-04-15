<template>
  <!-- 两栏布局 -->
  <two-column-layout :leftColumnTitle="leftColumnTitle">
    <template v-slot:left-content>
      菜单树adadadadsda
      <p>惨淡菜单菜单菜</p>
    </template>
    <template v-slot:right-content>
      <div class="title">
        <el-button type="warning">禁止登录</el-button>
        <el-button type="danger">强制注销所有会话</el-button>
      </div>
    </template>
  </two-column-layout>
</template>

<script>
// import { getInfo } from '@/api/sysManage/sysInfo'
import TwoColumnLayout from '@/components/TwoColumnLayout/index'
export default {
  name: 'sysInfo',
  components: {
    TwoColumnLayout
  },
  data() {
    return {
      leftColumnTitle: '菜单栏标题'
    }
  },
  created() {
    // this.router = this.$store.getters.addRouters
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .title{
    padding-bottom:20px;
  }
</style>
