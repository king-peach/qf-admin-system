<template>
  <div class="container">
    <div :class="['left-column-box', leftColumnShow ? 'show': 'hide']" :style="leftColumnShow ? 'width: ' + leftColumnWidth + ';' : 'width: 0;'">
      <header :style="leftColumnShow ? 'display: block;' : 'display: none;'">
        <h4>{{ leftColumnTitle }}</h4>
      </header>
      <section :style="leftColumnShow ? 'display: block;' : 'display: none;'">
        <slot name="left-content" />
      </section>
      <div :class="['aside-wrapper', 'to-hide', leftColumnShow ? '' : 'hide']" @click="handleColumnHide">
        <div />
      </div>
      <div :class="['aside-wrapper', 'to-show', leftColumnShow ? 'hide' : '']" @click="handleColumnShow">
        <div />
      </div>
    </div>
    <div class="right-column-box">
      <slot name="right-content" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'TwoColumnLayout',
  props: {
    leftColumnTitle: {
      type: String,
      default: '左侧菜单标题'
    },
    leftColumnWidth: {
      type: String,
      default: '18%'
    }
  },
  data() {
    return {
      leftColumnShow: true
    }
  },
  methods: {
    handleColumnHide() {
      this.leftColumnShow = false
    },
    handleColumnShow() {
      this.leftColumnShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .left-column-box {
    float: left;
    width: 18%;
    color: #909399;
    min-height: calc(100vh - 84px);
    background-color: #FFF;
    border-right: 10px solid #eee;
    position: relative;
    transition: all .5s;
    &.hide {
      width: 0;
      font-size: 0;
    }
    &.show {
      width: 18%;
      font-size: inherit;
    }
    header {
      border-bottom: 1px solid #ebeef5;
      h4 {
        text-align: center;
        font-weight: 500;
      }
    }
    section {
      padding: 20px 15px;
    }
    .aside-wrapper {
      position: absolute;
      height: 50px;
      width: 10px;
      background-color: #dcdfe6;
      right: -10px;
      top: 50%;
      transform: translateY(-50%);
      &:hover {
        background-color: #ffbb3d;
      }
      div {
        border: 5px solid transparent;
        border-right-color: #666;
        position: relative;
        top: 50%;
        right: 2px;
        transform: translateY(-50%);
      }
      &.to-show {
        div {
          border-right-color: transparent;
          left: 2px;
          border-left-color: #666;
        }
      }
      &.hide {
        display: none;
      }
    }
  }
  .right-column-box {
    overflow: hidden;
    min-height: calc(100vh - 84px);
    padding: 20px 30px;
  }
}
</style>
