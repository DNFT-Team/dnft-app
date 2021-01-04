<template>
  <div class="page-header">
    <span class="header-title" @click="handleGoHome">NFT交易市场</span>
    <div class="header-right">
      <el-button type="primary" plain @click="handleToMarket">交易大厅</el-button>
      <el-button type="primary" plain @click="handleToAuction">拍卖中心</el-button>
      <el-button type="primary" plain @click="handleToTax">交税中心</el-button>
<!--      <span class="connect-wallet-btn">连接钱包</span>-->
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleGoHome() {
      this.$router.push('/');
    },
    handleToMarket() {
      this.$router.push('/');
    },
    handleToAuction() {
      this.$router.push('/auction');
    },
    handleToTax() {
      this.$router.push({
        name:'TaxList'
      });
    },
  },
};
</script>

<style lang="less">
.page-header {
  height: 60px;
  line-height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 30px;
  background-color: #fff;
  .header-title {
    font-size: 28px;
    font-weight: 700;
    cursor: pointer;
  }
  .header-right {
    .connect-wallet-btn {
      display: inline-block;
      width: 158px;
      height: 46px;
      background-color: #112DF2;
      color: #fff;
      text-align: center;
      line-height: 46px;
      border-radius: 25px;
      cursor: pointer;
      margin-left: 20px;
    }
  }
}
</style>
