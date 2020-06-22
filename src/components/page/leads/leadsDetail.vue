<template>
  <el-card>
    <info-detail-viewer
      v-loading="loading"
      :state="leadsDetail"
    />
  </el-card>
</template>

<script>
  import { mapState } from 'vuex';
  import InfoDetailViewer from 'common/InfoDetailViewer';
  export default {
    name: 'LeadsDetail',
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
        leadsDetail: state => state.leads.leadsDetail
      })
    },
    mounted() {
      this.id = this.$route.query.id;
      this.fetch(this.id);
    },
    async activated() {
      if (this.$route.query.id.toString() !== this.id.toString()) {
        this.id = this.$route.query.id;
        this.fetch(this.id);
      }
    },
    methods: {
      async fetch(id) {
        this.loading = true;
        await this.$store.dispatch('leads/getLeadsDetail', { id });
        this.loading = false;
      }
    }
  };
</script>

<style scoped>

</style>
