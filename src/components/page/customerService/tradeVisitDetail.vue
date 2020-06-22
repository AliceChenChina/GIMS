<template>
  <el-card>
    <info-detail-viewer
      v-loading="loading"
      :state="tradeVisitDetail"
    />
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'TradeVisitDetail',
    components: {
      InfoDetailViewer
    },
    data() {
      return {
        loading: false,
        id: ''
      };
    },
    computed: {
      ...mapState({
        tradeVisitDetail: state => state.customerService.tradeVisitDetail
      })
    },
    async mounted() {
      this.id = this.$route.params.id;
      const sessionId = window.sessionStorage.getItem('trade_visit__detail_id');
      if (!this.id && sessionId) {
        this.id = sessionId;
        await this.fetch(sessionId);
      } else {
        window.sessionStorage.setItem('trade_visit__detail_id', this.id);
        await this.fetch(this.id);
      }
    },
    async activated() {
      if (!this.$route.params.id) {
        return;
      }
      if (this.$route.params.id.toString() !== this.id.toString()) {
        this.id = this.$route.params.id;
        await this.fetch(this.id);
      }
    },
    methods: {
      async fetch(id) {
        this.loading = true;
        await this.$store.dispatch('customerService/getTradeVisitDetail', { id });
        this.loading = false;
      },
      closeCurrentTag() {
        const tagsChildrens = this.$parent.$children;
        // eslint-disable-next-line no-unused-vars
        let tagIndex;
        for (let i = 0; i < tagsChildrens.length; i++) {
          if (tagsChildrens[i].$el.className === 'tags') {
            tagIndex = i;
            break;
          }
        }
        const tabs = document.getElementsByClassName('tags-li');
        // eslint-disable-next-line no-unused-vars
        let tabIndex;
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].className.indexOf('active') > 0) {
            tabIndex = i;
            break;
          }
        }
        tagsChildrens[tagIndex].closeTags(tabIndex);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .bottom-op {
    display: flex;
    align-items: center;
    justify-content: center;
    bottom: 0;
    height: 60px;
    width: 100%;
    background: #fff;
  }
</style>
