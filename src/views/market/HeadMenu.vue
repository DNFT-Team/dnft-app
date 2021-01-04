<template>
  <div class="market-head-menu">
    <div class="category-list">
      <span :class="{'selected': selected === 'all'}" @click="handleSelect('all')">所有目录</span>
      <span :class="{'selected': selected === 'selllist'}" @click="handleSelect('selllist')">销售记录</span>
      <span :class="{'selected': selected === 'myselllist'}" @click="handleSelect('myselllist')">我的购买记录</span>
    </div>
    <div>
      <el-button @click="handleCreateNFT">创建NFT</el-button>
      <el-button @click="handleCteateNFTCategory">创建NFT类别</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: 'all',
    };
  },
  methods: {
    handleCreateNFT() {
      this.$router.push('/createnft');
    },
    handleCteateNFTCategory() {
      this.$router.push('/createnftcategory');
    },
    handleSelect(value) {
      this.selected = value;
    },
  },
};
</script>

<style lang="less">
.market-head-menu {
  height: 45px;
  margin: 10px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .category-list {
    >span {
      font-size: 12px;
      display: inline-block;
      width: 103px;
      height: 30px;
      line-height: 30px;
      color: #0A4F8B;
      margin: 0px 10px;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
    }
    .selected {
      background-color: #0A4F8B;
      color: #ffffff;
    }
  }

}
</style>
