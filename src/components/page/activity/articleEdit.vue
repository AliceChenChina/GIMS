<template>
  <div class="activity-edit" v-loading="loading">
    <div class="op-row">
      <el-button size="big" type="danger" @click="save">保存修改</el-button>
    </div>
    <div class="preview-area">
<!--      <div class="preview-title">-->
<!--        <img src='@/assets/img/ios_head.png' class="ios-head" alt="" />-->
<!--        <div class="ios-head-title">{{perviewTitle}}</div>-->
<!--      </div>-->
      <div class="op-area">
        <VueUeditorWrap v-model="editorData" :config="editorConfig"/>
      </div>
    </div>
  </div>
</template>
<script>
  import VueUeditorWrap from 'vue-ueditor-wrap';
  import { ActivityResultWrapper } from '@/api/ResultWrapper';
  import './activity.scss';
  import FetchApiFactory from '@/api/fetchApi';
  export default {
    name: 'ArticleEdit',
    data() {
      return {
        loading: false,
        uploadLoading: false,
        perviewTitle: this.$route.query.title,
        toolbars: [],
        editorData: '',
        articleId: '',
        editorConfig: {
          language: 'zh',
          elementPathEnabled : false,
          wordCount:false,
          UEDITOR_HOME_URL: window.UEDITOR_HOME_URL,
          serverUrl: '/config',
          headers: {
            Authorizations: '22'
          },
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 500,
          // 初始容器宽度
          initialFrameWidth: '100%',
          toolbars: this.toolbars
        }
      }
    },
    created(){
      this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, new ActivityResultWrapper());
      this.toolbars = [
        ['source',"more", 'undo', 'redo', "|", "fontsize", "|", "blockquote", "horizontal", "|", "removeformat", "|", "insertimage", 'insertaudio',"fullscreen"],
        ["bold", "italic", "underline", "forecolor", "backcolor", "|", "justifyleft", "justifycenter", "justifyright", "|", "rowspacingtop", "rowspacingbottom", "lineheight", "|", "insertorderedlist", "insertunorderedlist", "|", "preview","link"]
      ];
      this.editorConfig.toolbars = this.toolbars;
      this.fetchData();
    },
    activated(){
      this.requestInstance = FetchApiFactory.getFetchInstance('/activity', false, new ActivityResultWrapper());
      this.toolbars = [
        ['source',"more", 'undo', 'redo', "|", "fontsize", "|", "blockquote", "horizontal", "|", "removeformat", "|", "insertimage", 'insertaudio',"fullscreen"],
        ["bold", "italic", "underline", "forecolor", "backcolor", "|", "justifyleft", "justifycenter", "justifyright", "|", "rowspacingtop", "rowspacingbottom", "lineheight", "|", "insertorderedlist", "insertunorderedlist", "|", "preview","link" ]
      ];
      this.editorConfig.toolbars = this.toolbars;
      this.fetchData();

    },
    mounted(){
      this.fetchData();
    },
    components: {
      VueUeditorWrap
    },
    methods: {
      async fetchData(){
        this.uploadLoading = true;
        const res = await this.requestInstance.setParam('/detail/findActivityById',
          { activityId: this.$route.query.activityId }).doRequest();
        this.uploadLoading = false;
        this.activityDetail = this.convertDetailItemsRes(res);
      },
      convertDetailItemsRes(res){
        const converted = this.$utils.jsonClone(res);
        const articleContent = (converted.pictureInfo && converted.pictureInfo[0] && converted.pictureInfo[0].pictureLink) || '';
        this.articleId = (converted.pictureInfo && converted.pictureInfo[0] && converted.pictureInfo[0].id) || '';
        this.editorData = articleContent;
        console.log(this.editorData)
      },
      async save(){
        const para = {};
        para.id = this.$route.query.activityId;
        para.pictureInfo = [{}];
        para.pictureInfo[0] = {
          attachType: 3, // 1.图片2.视频3.文本
          bottomFlag: 0,
          hotInfo: [],
          id: this.articleId,
          pictureLink: this.editorData,
          pictureOrder: 1
        }
        console.log(this.editorData)
        try {
          this.loading = true;
          await this.requestInstance.setParam('/detail/updateActivity', para).doRequest();
          this.$message.success('操作成功！');
          this.fetchData();
          // this.setEmptyChoosed();
          this.$bus.$emit('close_current_tags');
        } catch (e) {
          this.$message.error(e);
        }
        this.loading = false;
      }
    }
  };
</script>
