<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item><i class="el-icon-lee-home"></i> 首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ text }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    }
  };
</script>
