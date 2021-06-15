<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">Recycle</span>
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
    <el-row :gutter="20" class="card-wrap">
      <el-col :span="6" v-for="(item,i) in data_hs" :key="i">
        <GoodsItem :item="item" show-cut/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import GoodsItem from "./../components/GoodsItem";

  export default {
    name: "Recycle",
    components: {GoodsItem},
    created() {
      const ran = Math.random()*20
      this.data_hs = new Array(20).fill(1).map((e,i)=>({
        id:i,
        name: 'ShanghaiBar',
        owner: 'Billy',
        price:1.25,
        favor: 100,
        src: `https://unsplash.it/300/280?random=${Math.ceil(i+ran)}`,
        recycle: new Date('2021-08-01 00:00:00')
      }))
    },
    data() {
      return {
        query: {
          sort: 'favor'
        },
        opts_sort: [
          {
            title: 'Favor',
            group: [{text: 'Most Favourite', value: 'favor'}]
          },
          {
            title: 'Price',
            group: [
              {text: 'High to low', value: 'asc'},
              {text: 'Low to High', value: 'desc'}
            ]
          }
        ],
        data_hs : []
      }
    }
  }
</script>

<style scoped>
  .mk-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .4rem 1.6rem;
    background: white;
  }

</style>
