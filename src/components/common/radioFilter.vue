<template>
  <div class="radio-group-filter">
    <div class="title">
      {{ title }}
    </div>
    <el-radio-group :value="value" @input="onInput">
      <slot></slot>
    </el-radio-group>
  </div>
</template>

<script>
  /*
  单选条件过滤器
   */
  export default {
    name: 'RadioFilter',
    props: {
      title: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        radio: ''
      };
    },
    methods: {
      onInput(value) {
        this.$emit('input', value);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .radio-group-filter {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    align-items: center;
    height: 30px;
    line-height: 1;
    .title {
      color: #999;
      width: 100px;
      height: 60%;
      display: flex;
      align-items: center;
      border-right: 1px solid #bbbabc;
    }
    /*border-top: 1px solid #ececec;*/
  }
</style>

<style lang="scss">
  .radio-group-filter {
    .el-radio__input {
      display: none;
    }
  }
  .radio-group-filter.el-custom-filter {
    max-width: 100% !important;
    margin-left: 0 !important;
  }
</style>
