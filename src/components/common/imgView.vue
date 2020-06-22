<template>
  <div>
    <template v-if="fileList.length != 0">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li v-for="(item,index) in fileList" :key="index" class="el-upload-list__item is-success">
          <img :src="item.url" alt="" class="el-upload-list__item-thumbnail">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="preview(item)"><i class="el-icon-zoom-in"></i></span>
          </span>
        </li>
      </ul>
    </template>
    <template v-else>
      <span style="font-size: 12px;color: #666;">无附件</span>
    </template>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      files: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        dialogVisible: false, // 大图是否显示
        fileList: this.files, // 当前图片list
        dialogImageUrl: '' // 当前预览image大图url
      };
    },
    methods: {
      preview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  };
</script>
