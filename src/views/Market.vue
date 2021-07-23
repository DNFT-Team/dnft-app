<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">Market</span>
      <div>
        <vs-select
          color="danger"
          label="Sort"
          v-model="query.sort"
        >
          <div :key="index" v-for="(item,index) in opts_sort">
            <vs-select-group :title="item.title" v-if="item.group">
              <vs-select-item :key="index" :value="item.value" :text="item.text"
                              v-for="(item,index) in item.group"/>
            </vs-select-group>
          </div>
        </vs-select>
      </div>
    </div>
    <el-row v-if="data_hs.length>0" :gutter="20" class="card-wrap">
      <el-col :span="6" v-for="(item,i) in data_hs" :key="i">
        <GoodsItem :item="item" :show-recycle="true"/>
      </el-col>
    </el-row>
    <Empty v-else/>
  </div>
</template>

<script>
import GoodsItem from '../components/GoodsItem';
import Empty from '../components/Empty';

export default {
  name: 'Market',
  components: { GoodsItem, Empty },
  data() {
    return {
      query: {
        sort: 'favor',
      },
      opts_sort: [
        {
          title: 'Favor',
          group: [{ text: 'Most Favourite', value: 'favor' }],
        },
        {
          title: 'Price',
          group: [
            { text: 'High to low', value: 'asc' },
            { text: 'Low to High', value: 'desc' },
          ],
        },
      ],
      data_hs: [],
    };
  },
  computed: {
    chainOk() {
      return this.$store.state.chainState.Api && this.$store.state.chainState.isConnected;
    },
  },
  watch: {
    chainOk(bool) {
      bool && this.fetchOfferedNft();
    },
  },
  methods: {
    fetchOfferedNft() {
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      this.$api.NFT_List().then((res) => {
        this.data_hs = res.filter((e) => e.status === 'Offered').map((e) => ({
          ...e,
          favor: 100,
          src: e.data,
          recycle: new Date('2021-08-01 00:00:00'),
          name: e.metadata,
          hash: e.tokenId,
        }));
      }).catch(() => {
        this.data_hs = [];
      }).finally(() => {
        this.$vs.loading.close();
      });
    },
  },
  mounted() {
    this.chainOk && this.fetchOfferedNft();
  },
};
</script>

<style scoped>
</style>
