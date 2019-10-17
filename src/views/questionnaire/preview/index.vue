<template>
  <div class="main">
    <div class="header">
      <div class="tip-wrapper">
        <span>提示: </span>
        此为预览页面，不能参与作答
      </div>
      <div class="preview-options">
        <div class="pc_preview active">
          <div>
            <svg-icon icon-class="pc" />
          </div>
          <span>电脑预览</span>
        </div>
        <div class="close_preview" @click="$router.go(-1)">
          <div>
            <i class="el-icon-circle-close-outline" style="font-size: 24px;" />
          </div>
          <span>关闭预览</span>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="questionnaire_main">
        <div class="survey">
          <div class="title-wrapper">
            <h1 class="title">{{ data.title }}</h1>
            <div v-show="data.titleTip !== ''" class="title-tip">
              {{ data.titleTip }}
            </div>
          </div>
          <div class="questionnaire_options">
            <template v-for="(item, index) in data.questionnaireData">
              <div :key="index" class="item-wrapper">
                <template v-if="item.type === 'radio'">
                  <div class="item-title-wrapper">
                    <span v-show="item.required" class="required">*</span>
                    <div class="index">{{ item.index + 1 }}.</div>
                    <div class="item-title" v-html="item.itemTitle" />
                  </div>
                  <div class="item-title-tip" v-html="item.titleTip" />
                  <div class="item-question">
                    <div v-for="(ele, num) in item.tableOptions" :key="num" :style="`width: calc(100% / ${item.currentRows} - 10px)`" :class="ele.questionImg.src ? 'option-item box-border center' : 'option-item'">
                      <img v-show="ele.questionImg.src" :src="ele.questionImg.src" :style="`width: ${ele.questionImg.width};height: ${ele.questionImg.height}`" alt="展示图片">
                      <div v-show="ele.questionImg.src" class="imgOption-item-tip" v-html="ele.questionTip.html" />
                      <el-radio v-model="item.defaultSelected" :label="num + 1">
                        {{ ele.questionTitle }}
                      </el-radio>
                      <div v-show="!ele.questionImg.src" class="option-item-tip" v-html="ele.questionTip.html" />
                    </div>
                  </div>
                </template>
                <template v-else-if="item.type === 'checkBox'">
                  <div class="item-title-wrapper">
                    <span class="required">*</span>
                    <div class="index">{{ item.index + 1 }}.</div>
                    <div class="item-title" v-html="item.itemTitle" />
                  </div>
                  <div class="item-title-tip" v-html="item.titleTip" />
                  <div class="item-question">
                    <div v-for="(ele, num) in item.tableOptions" :key="num" :style="`width: calc(100% / ${item.currentRows} - 10px)`" :class="ele.questionImg.src ? 'option-item box-border center': 'option-item'">
                      <img v-show="ele.questionImg.src" :src="ele.questionImg.src" :style="`width: ${ele.questionImg.width};height: ${ele.questionImg.height}`" alt="展示图片">
                      <div v-show="ele.questionImg.src" class="imgOption-item-tip" v-html="ele.questionTip.html" />
                      <el-checkbox v-model="ele.questionChecked" @change="handleCheckBoxChange(index, $event)">
                        {{ ele.questionTitle }}
                      </el-checkbox>
                      <div v-show="!ele.questionImg.src" class="option-item-tip" v-html="ele.questionTip.html" />
                    </div>
                  </div>
                </template>
                <template v-else-if="item.type === 'select'">
                  <div class="item-title-wrapper">
                    <span class="required">*</span>
                    <div class="index">{{ item.index + 1 }}.</div>
                    <div class="item-title" v-html="item.itemTitle" />
                  </div>
                  <div class="item-title-tip" v-html="item.titleTip" />
                  <div class="item-question">
                    <el-select v-model="item.selectVal" placeholder="请选择" @blur="handleSelect(index)">
                      <el-option
                        v-for="ele in item.tableOptions"
                        :key="ele.questionTitle"
                        :label="ele.placeholder"
                        :value="ele.questionTitle"
                      />
                    </el-select>
                  </div>
                </template>
                <template v-else-if="item.type === 'singleInput'">
                  <div class="item-title-wrapper">
                    <span class="required">*</span>
                    <div class="index">{{ item.index + 1 }}.</div>
                    <div class="item-title" v-html="item.itemTitle" />
                  </div>
                  <div class="item-title-tip" v-html="item.titleTip" />
                  <div class="item-question">
                    <el-input
                      v-model="item.singleTextarea"
                      type="textarea"
                      :rows="item.currentHeight === '' ? 1 : item.currentHeight"
                      :style="item.currentWidth === '' ? '' : 'width: ' + item.currentWidth + 'px;'"
                    />
                  </div>
                </template>
                <template v-else-if="item.type === 'arrayInput'">
                  <div class="item-title-wrapper">
                    <span class="required">*</span>
                    <div class="index">{{ item.index + 1 }}.</div>
                    <div class="item-title" v-html="item.itemTitle" />
                  </div>
                  <div class="item-title-tip" v-html="item.titleTip" />
                  <div class="item-question">
                    <div v-for="(ele, num) in item.arrayInputData" :key="num" class="array-input-row-wrapper">
                      <span class="m-title">{{ ele.rowTitle }}</span>
                      <el-input
                        v-model="ele.value"
                        type="textarea"
                        rows="1"
                        class="m-input"
                      />
                      <span>{{ ele.limitTip }}</span>
                      <span v-show="!item.required && ele.required" class="m-required-wrapper">*</span>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
          <div class="submit_wrapper">
            <span>提交</span>
          </div>
        </div>
        <div class="m-footer">
          <div class="line" />
          <div class="copyright">湖南七风科技有限公司</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils/deepClone'
export default {
  name: 'questionnairePrevieww',
  data() {
    return {
      data: {
        title: '',
        titleTip: '',
        questionnaireData: [
          {
            type: 'radio',
            index: 0,
            itemTitle: '标题',
            required: true,
            titleTip: '',
            currentRows: 4,
            defaultSelected: 2,
            tableOptions: [
              { questionTitle: '选项1', placeholder: '选项1', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
              { questionTitle: '选项2', placeholder: '选项2', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
              { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
            ]
          },
          {
            type: 'checkBox',
            index: 1,
            itemTitle: '标题',
            required: true,
            titleTip: '',
            currentRows: 4,
            tableOptions: [
              { questionTitle: '选项1', placeholder: '选项1', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: true },
              { questionTitle: '选项2', placeholder: '选项2', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: true },
              { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
            ]
          },
          {
            type: 'select',
            index: 2,
            itemTitle: '标题',
            required: true,
            titleTip: '',
            selectVal: '',
            currentRows: 4,
            tableOptions: [
              { questionTitle: '选项1', placeholder: '选项1', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: true },
              { questionTitle: '选项2', placeholder: '选项2', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: true },
              { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
            ]
          },
          {
            type: 'singleInput',
            editVisible: false,
            index: 3,
            itemTitle: '标题',
            required: true,
            titleTip: '',
            minLimit: '',
            maxLimit: '',
            singleTextarea: '',
            currentWidth: null,
            currentHeight: null
          },
          {
            type: 'arrayInput',
            editVisible: false,
            index: 4,
            itemTitle: '标题',
            required: true,
            titleTip: '标题说明',
            arrayInputData: [
              { rowTitle: '填空1', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' },
              { rowTitle: '填空2', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.data = deepClone(this.$store.getters.update_questionnaire)
  },
  methods: {
    /**
     * @method 多选问题必填校验
     * @param {Number} index 当前问题索引
     * @param {String} selected 更新后的值
     */
    handleCheckBoxChange(index, selected) {
      if (!this.data.questionnaireData[index].required) return false

      if (!selected) {
        let flag = false
        this.data.questionnaireData[index].tableOptions.forEach(item => {
          if (item.questionChecked === true) flag = true
        })

        if (!flag) {
          this.$notify({
            type: 'error',
            message: '当前项为必填项, 请选择你的答案'
          })
        }
      }
    },
    /**
     * @method 下拉框值必填校验
     * @param {String} index 当前问题索引
     */
    handleSelect(index) {
      if (!this.data.questionnaireData[index].required) return false

      if (this.data.questionnaireData[index].selectVal === '') {
        // this.$notify({
        //   type: 'error',
        //   message: '当前项为必填项, 请选择你的答案'
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 70px;
  box-shadow: 0 1px 0 0 #e8e8e8;
  position: relative;
  overflow: hidden;
  .tip-wrapper {
    display: inline-block;
    line-height: 70px;
    color: #888;
    font-size: 14px;
    margin-left: 10%;
    font-weight: 500;
    span {
      color: #FF5500;
    }
  }
  .preview-options {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    font-size: 13px;
    div {
      display: inline-block;
      border-left: 1px solid #f0f0f0;
      width: 88px;
      height: 70px;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #fafafa;
      }
      &.active {
        background-color: #409EFF;
        color: #fff;
        div {
          background-color: #409EFF;
          color: #fff;
        }
      }
      div {
        height: 45px;
        padding-top: 15px;
        border: none;
        font-size: 18px;
      }
      &:last-child {
        border-right: 1px solid #f0f0f0;
      }
    }
  }
}
.container {
  background-color: #f5f5f5;
  background-position: center top;
  min-height: 1256px;
  padding-top: 120px;
  .questionnaire_main {
    width: 920px;
    margin: 0 auto;
    background-color: #fff;
    .survey {
      width: 780px;
      line-height: 20px;
      word-wrap: break-word;
      padding: 0;
      margin: 0 auto;
      .title-wrapper {
        line-height: 20px;
        width: 96%;
        padding: 40px 2% 30px;
        .title {
          color: #5A83E5;
          font-size: 24px;
          font-weight: bold;
          vertical-align: middle;
          line-height: 30px;
          padding: 15px 0;
          text-align: center;
          margin: 0;
        }
        .title-tip {
          color: #555;
          line-height: 24px;
          text-align: left;
          font-size: 16px;
          padding-bottom: 15px;
          border-bottom: 1px dashed #ccc;
          margin-top: 20px;
        }
      }
      .questionnaire_options {
        padding: 2%;
        .item-wrapper {
          padding: 4px 4px 40px 4px;
          width: 96%;
          .item-title-wrapper {
            padding-top: 2px;
            font-size: 15px;
            color: #444;
            font-weight: bold;
            height: auto;
            line-height: 20px;
            .required {
              color: red;
              vertical-align: middle;
              margin-right: 4px;
            }
            .index {
              display: inline-block;
              width: 28px;
            }
            .item-title {
              display: inline-block;
              width: 660px;
            }
          }
          .item-title-tip {
            padding: 8px 0 0 38px;
            color: #666;
            font-size: 14px;
          }
          .item-question {
            padding: 8px 0 10px 38px;
            border-bottom: 1px solid #EFEFEF;
            line-height: 30px;
            .option-item {
              display: inline-block;
              margin-right: 10px;
              padding-bottom: 5px;
              border-radius: 5px;
              overflow: hidden;
              .imgOption-item-tip,
              .option-item-tip {
                font-size: 14px;
                color: #666;
              }
              &.center {
                text-align: center;
              }
            }
            .array-input-row-wrapper {
              margin-bottom: 10px;
              span {
                vertical-align: middle;
                &:nth-child(3) {
                  margin-left: 5px;
                }
              }
              .m-title {
                display: inline-block;
                width: 10%;
                vertical-align: middle;
                padding: 5px;
                word-break: break-all;
              }
              .m-input {
                display: inline-block;
                width: 50%;
                vertical-align: middle;
              }
              .m-required-wrapper {
                margin-left: 10px;
                color: red;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .submit_wrapper {
        padding-top: 6px 0 10px 0;
        height: 80px;
        line-height: 80px;
        text-align: center;
        span {
          padding: 0 24px;
          height: 32px;
          line-height: 32px;
          border: 1px solid transparent;
          background: #5A83E5;
          display: inline-block;
          color: #fff;
          text-align: center;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          &:hover {
            background: #486FCA;
          }
        }
      }
    }
    .m-footer {
      padding-top: 30px;
      margin-top: 30px;
      .line {
        width: 95%;
        margin: 0 auto;
        height: 1px;
        background-color: #999;
      }
      .copyright {
        height: 60px;
        font-size: 14px;
        color: #666;
        line-height: 60px;
        text-align: center;
      }
    }
  }
}
</style>
