<template>
  <div id="main">
    <search-box :formData="searchForm" />
    <!-- 问卷列表 -->
    <div class="list-wrapper">
      <h4>问卷列表</h4>
      <template v-for="(item, index) in questionList">
        <div :key="index" class="question-item-wrapper">
          <div class="m-top">
            <span class="u-left">{{ item.title }}</span>
            <div class="u-right">
              <span>ID: {{ item.id }}</span>
              <span class="u-status"><i />{{ item.status }}</span>
              <span>答卷: {{ item.solutionNum }}</span>
              <span>{{ item.date }}</span>
            </div>
          </div>
          <div class="m-bottom">
            <div class="u-left">
              <router-link to="./design" class="pull-left release-items">
                <i class="icon-design" />
                设计问卷
              </router-link>
              <span class="pull-left release-items">
                <i class="icon-send" />
                发送问卷
              </span>
              <span class="pull-left release-items">
                <i class="icon-data" />
                分析&amp;下载
              </span>
            </div>
            <div class="u-right">
              <span class="pull-right">
                <svg-icon icon-class="cloud-upload" class="icon-publish" />
                发布
              </span>
              <i class="splitline" />
              <span class="pull-right">
                <svg-icon icon-class="copy" />
                复制
              </span>
              <span class="pull-right">
                <svg-icon icon-class="delete" />
                删除
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'
export default {
  name: 'questinnaire',
  components: {
    SearchBox
  },
  data() {
    return {
      searchForm: {
        status: {
          name: '状态',
          value: null
        }
      },
      questionList: [{
        title: '测试',
        id: 12345,
        status: '未发布',
        solutionNum: 0,
        date: '2019-08-23'
      }, {
        title: '测试',
        id: 12345,
        status: '未发布',
        solutionNum: 0,
        date: '2019-09-02'
      }, {
        title: '测试',
        id: 12345,
        status: '未发布',
        solutionNum: 0,
        date: '2019-09-03'
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  .question-item-wrapper {
    border: 1px solid #eee;
    border-radius: 2px;
    box-shadow: 0px 2px 4px 1px #e3e3e3;
    -webkit-box-shadow: 0px 2px 4px 1px #e3e3e3;
    padding: 12px 10px;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .m-top {
      padding-bottom: 10px;
      border-bottom: 1px solid #E3E3E3;
      font-size: 12px;
      overflow: hidden;
      .u-left {
        float: left;
        font-size: 16px;
      }
      .u-right {
        float: right;
        span {
          margin-left: 10px;
          &.u-status {
            i {
              vertical-align: middle;
              display: inline-block;
              width: 8px;
              height: 8px;
              background-color: #5daf34;
              border-radius: 50%;
              margin-right: 3px;
              &.btn-disabled {
                background-color: #999;
              }
            }
          }
        }
      }
    }
    .m-bottom {
      overflow: hidden;
      padding-top: 10px;
      .u-left {
        float: left;
        .pull-left {
          line-height: 36px;
          margin-right: 14px;
          cursor: pointer;
          &:hover {
            color: #0085ff;
          }
          i {
            display: inline-block;
            width: 22px;
            height: 28px;
            vertical-align: middle;
            margin-right: 4px;
            position: relative;
            top: -2px;
            &.icon-design {
              background: url('../../../assets/icon-design-questionnaire.png') no-repeat 0 0 / 100% 100%;
            }
            &.icon-send {
              background: url('../../../assets/icon-spread-questionnaire.png') no-repeat 0 0 / 100% 100%;
            }
            &.icon-data {
              background: url('../../../assets/icon-data-questionnaire.png') no-repeat 0 0 / 100% 100%;
            }
          }
        }
      }
      .u-right {
        float: right;
        .pull-right {
          line-height: 36px;
          font-size: 12px;
          color: #7a7a7a;
          margin-left: 12px;
          &:hover {
            color: #333;
            cursor: pointer;
          }
          .svg-icon {
            vertical-align: middle;
            margin-right: 4px;
            &.icon-publish {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
.splitline {
  float: left;
  margin-top: 7px;
  display: inline-block;
  width: 1px;
  height: 22px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240,240,240,1) 55%, rgba(255,255,255,1) 100%);
  background: -webkit-linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(240,240,240,1) 55%, rgba(255,255,255,1) 100%);
}
</style>

