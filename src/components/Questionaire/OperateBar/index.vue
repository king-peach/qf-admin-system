<template>
  <div class="operate-bar">
    <span class="operate-button" @click="edit">
      <i class="el-icon-edit" />
      edit
    </span>
    <span class="operate-button" @click="del">
      <i class="el-icon-delete" />
      delete
    </span>
    <span class="operate-button" @click="moveUp">
      <i class="el-icon-arrow-up" />
      up
    </span>
    <span class="operate-button" @click="moveDown">
      <i class="el-icon-arrow-down" />
      down
    </span>
    <span class="operate-button" @click="moveTop">
      <i class="el-icon-sort-up" />
      top
    </span>
    <span class="operate-button" @click="moveBottom">
      <i class="el-icon-sort-down" />
      bottom
    </span>
  </div>
</template>

<script>
export default {
  name: 'operateBar',
  methods: {
    /**
     * @method ??
     */
    edit() {
      this.$emit('edit')
    },
    /**
     * @method ??
     */
    del() {
      this.$emit('del')
    },
    /**
     * @method ??
     */
    moveUp() {
      this.$emit('moveUp')
    },
    /**
     * @method ??
     */
    moveDown() {
      this.$emit('moveDown')
    },
    /**
     * @method ????
     */
    moveTop() {
      this.$emit('moveTop')
    },
    /**
     * @method ????
     */
    moveBottom() {
      this.$emit('moveBottom')
    }
  }
}
</script>

<style lang="scss" scoped>
.operate-button {
  display: inline-block;
  margin-right: 15px;
  color: #999;
  font-size: 14px;
  padding: 4px 6px;
  border: 1px solid #7d7d7d;
  border-radius: 2px;
  cursor: pointer;
  &:nth-child(2):hover {
    color: #f56c6c;
    border-color: #f56c6c;
  }
  &:not(:nth-child(2)):hover {
    color: #409EFF;
    border-color: #409EFF;
  }
}
</style>
