<template>
  <el-card v-loading="isLoading" class="box-card">
    <assetInfo
      :state="state"
    />
  </el-card>
</template>

<script>
  import assetInfo from '@/components/page/myConsumer/assetInfo';
  import { mapState } from 'vuex';
  export default {
    name: 'ManageAssetsList',
    components: {
      assetInfo
    },
    data() {
      return {
        isLoading: false
      };
    },
    computed: {
      ...mapState({
        state: state => state.myConsumer.manageAssetsListState
      })
    },
    async mounted() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        this.isLoading = true;
        await this.$store.dispatch('myConsumer/getManageAssetsList', {});
        this.isLoading = false;
      }
    }
  };
</script>
