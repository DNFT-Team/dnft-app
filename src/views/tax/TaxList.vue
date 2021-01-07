<template>
  <div>
    <p>交税中心</p>
    <div class="market-search-box">
      <el-input style="width: 300px;" placeholder="请输入内容" v-model="value" class="input-with-select">
        <el-button  @click="getTaxList" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="project-list">
      <ul v-if="list.length>0">
        <li v-for="(item,index) in list" :key="index">
          <span>{{item}}</span>
        </li>
      </ul>
      <p v-else>暂无数据</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TaxList",
    data() {
      return {
        list: [],
        value: ''
      }
    },
    mounted() {
      localStorage.setItem('accountIndex', 0)
      if (this.$store.state.chainState.Api) {
        this.getTaxList()
      }
    },
    methods: {
      getTaxList() {
        this.$Nft.NFT_TaxList().then(res => {
          console.log(res)
          this.list = res
        })
      }
    }
  }
</script>

<style scoped>

</style>
