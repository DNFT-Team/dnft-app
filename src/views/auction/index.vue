<template>
  <div class="page-market">
    <side-bar></side-bar>
    <div class="project-content">
      <head-menu></head-menu>
      <p>拍卖中心</p>
      <div class="market-search-box">
        <el-input style="width: 300px;" placeholder="请输入内容" v-model="value" class="input-with-select">
          <el-button  @click="getNFTList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <div class="project-list">
        <ul v-if="list.length>0">
          <li v-for="(item,index) in list" :key="index">
            <project-card :dapp="item"></project-card>
          </li>
        </ul>
        <p v-else>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
// import dapps from '@/mock/auction';
import SideBar from './SideBar.vue';
import HeadMenu from './HeadMenu.vue';
import ProjectCard from './ProjectCard.vue';

export default {
  mounted() {
    localStorage.setItem('accountIndex', 1)
    if(this.$store.state.chainState.Api){
      this.getNFTList()
    }
  },
  components: {
    SideBar,
    HeadMenu,
    ProjectCard,
  },
  data() {
    return {
      value: '',
      list: []
    };
  },
  methods:{
    getNFTList() {
      this.$Nft.NFT_IdList().then(res=>{
        this.list = res
      })
    }
  }
};
</script>

<style lang="less">
.page-market {
  display: flex;
  flex-direction: row;
  .project-content {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    .market-search-box {
      height: 40px;
    }
  }
  .project-list {
    >ul {
      list-style: none;
      padding: 0px;
      margin: 0px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
}
</style>
