<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">Auction</span>
      <vs-button color="danger" type="line">Create Collection</vs-button>
      <vs-button color="danger" type="line">Create Auction</vs-button>
      <vs-select
        color="primary"
        label="Participant"
        v-model="query.type"
      >
        <vs-select-item v-for="(item,index) in opts_type" :key="index" :value="item.value"
                        :text="item.text"/>
      </vs-select>
    </div>
    <div class="card-wrap auc-bg">
      <template v-if="data_hs.length>0">
        <AuctionItem v-for="(item,i) in data_hs" :key="i" :item="item" />
      </template>
      <Empty v-else/>
    </div>
  </div>
</template>

<script>
  import AuctionItem from "../components/AuctionItem";
  import Empty from "../components/Empty";
  import mockApi from './../mock'
  export default {
    name: "Auction",
    components:{AuctionItem,Empty},
    data() {
      return {
        query: {
          type: 'all'
        },
        opts_type: [
          {text: 'All', value: 'all'},
          {text: 'Open', value: 'open'},
          {text: 'Blind-Auction', value: 'blind'},
          {text: 'Fixed-Price', value: 'fixed'}
        ],
        data_hs: []
      }
    },
    created() {
      // const participants = ['Open','Blind-Auction','Fixed-Price']
      this.data_hs = mockApi.getAuction(30)
    }
  }
</script>

<style scoped>
  .auc-bg{
    padding: 1rem;
    background: #0f0c29;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #24243e, #302b63, #0f0c29);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #24243e, #302b63, #0f0c29); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(232px,1fr));
    grid-gap: 30px;
  }
</style>
