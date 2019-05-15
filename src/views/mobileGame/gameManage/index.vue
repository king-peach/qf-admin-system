<template>
   <div id="main">
      <!-- 搜索组件 -->
      <search-box :formData="searchForm" />

      <div id="container"></div>
   </div>
</template>

<script>
import SearchBox from '@/components/SearchBox/index'
export default {
   name: 'gameManage',
   components: {
      SearchBox
   },
   data () {
      return {
         searchForm: {
            status: {
               label: '状态',
               value: null
            }
         }
      }
   }
}
</script>

