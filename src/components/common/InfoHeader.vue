<template>
  <div>
    <div class="desc-item">
      <div class="title-info mt25">
        <span>{{ infoTitle }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InfoHeader',
    props: {
      infoTitle: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped lang="scss">
  .desc-item {
    padding: 10px 0;
    .title-info{
      font-size: 16px;
      color: #EB5954;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
      span{
        padding: 5px;
        border-bottom: 2px solid #EB5954;
        display: inline-block;
        margin-bottom: -2px;
      }
      &:after {
        display: block;
        background: #bbbabc;
        height: 3px;
        margin-top: 8px;
      }
    }
  }
</style>
