<template>
  <div class="main">
    <el-tree :data="data">
      <el-table-column label="名称" prop="name">
        <span :value="data.name"></span>
      </el-table-column>
      <el-table-column label="机构主管" prop="leader">
        <span :value="data.leader"></span>
      </el-table-column>
      <el-table-column label="电话" prop="tel">
        <span :value="data.tel"></span>
      </el-table-column>
      <el-table-column label="传真" prop="fax">
        <span :value="data.fax"></span>
      </el-table-column>
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    const data = [{
      name: 'jack',
      leader: 'admin',
      tel: '13512415223',
      fax: '0730-124421',
      children: [{
        name: 'rose',
        leader: 'admin',
        tel: '1352452341',
        fax: '0731-124222'
      }, {
        name: 'rose',
        leader: 'admin',
        tel: '1352452341',
        fax: '0731-124222'
      }]
    }]
    return {
      data: JSON.parse(JSON.stringify(data))
    }
  }
}
</script>
