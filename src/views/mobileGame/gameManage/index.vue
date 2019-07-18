<template>
  <div id="main">
    <!-- 搜索组件 -->
    <search-box :formData="searchForm" />

    <div id="container">
      <!-- 按钮列表 -->
      <div style="padding: 10px;">
        <el-button icon="el-icon-plus">新建</el-button>
        <el-button icon="el-icon-delete">批量删除</el-button>
        <el-button icon="el-icon-sort-up" class="show-box">
          发布
          <i class="el-icon-caret-bottom" />
          <div>隐藏栏内容</div>
        </el-button>
        <el-button icon="el-icon-sort">
          全量发布
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-button icon="el-icon-sort-down">
          下线
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-button icon="el-icon-refresh">更新游戏列表缓存</el-button>
      </div>
      <!-- 游戏列表 -->
      <el-table ref="gameList" :data="gameList" @row-click="handleCurrent">
        <el-table-column type="index" />
        <el-table-column type="selection" />
        <el-table-column prop="icon" label="游戏图标" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.icon" alt="游戏icon" style="width: 3em">
          </template>
        </el-table-column>
        <el-table-column prop="name" label="游戏名" align="center" />
        <el-table-column label="状态" prop="status" align="center">
          <!-- <template slot-scope="scope">
            <el-switch v-model="scope.row.status" />
          </template> -->
        </el-table-column>
        <el-table-column prop="datetime" label="发布时间" min-width="120px" align="center" />
        <el-table-column label="操作" align="center" min-width="170px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEditCurrent(scope.row)">编辑信息</el-button>
            <el-button type="danger" size="mini" @click="removeCurrent(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox/index'
export default {
  name: 'gameManage',
  components: {
    SearchBox
  },
  data() {
    return {
      searchForm: {
        status: {
          label: '状态',
          value: null
        }
      },
      gameList: [
        {
          icon: 'https://www.119you.com/upload/gamelogo/161931_120x120.png?1520578965000',
          name: '龙门侠客',
          status: '已发布',
          datetime: '2019-01-18'
        }, {
          icon: 'https://www.119you.com/upload/gamelogo/161931_120x120.png?1520578965000',
          name: '龙门侠客',
          status: '已发布',
          datetime: '2019-01-20'
        }, {
          icon: 'https://www.119you.com/upload/gamelogo/161931_120x120.png?1520578965000',
          name: '龙门侠客',
          status: '未发布',
          datetime: '2019-01-10'
        }, {
          icon: 'https://www.119you.com/upload/gamelogo/161931_120x120.png?1520578965000',
          name: '龙门侠客',
          status: '未发布',
          datetime: '2019-01-08'
        }
      ]
    }
  },
  methods: {
    handleEditCurrent(row) {
      // this.$refs.gameList.toggleRowSelection(row)
    },
    handleCurrent(row, index) {
      this.$refs.gameList.clearSelection()
      this.$refs.gameList.toggleRowSelection(row)
    },
    removeCurrent(row, index) {
      this.$confirm('次操作将永久删除该游戏，不可恢复，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.gameList.splice(index, 1)
        this.$notify({
          type: 'success',
          message: '该游戏已删除'
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.show-box {
  position: relative;
  div {
    display: none;
    position: absolute;
    top: 50px;
    font-size: 1em;
  }
  &:hover {
    div {
      display: block;
      font-size: 1em;
      top: 5
    }
  }
}
</style>

