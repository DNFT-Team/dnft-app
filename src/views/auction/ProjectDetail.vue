<template>
  <div class="page-project-detail">
    <div class="project-icon">
      <img :src="dapp.icon" alt="">
    </div>
    <div class="project-info">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <span>{{dapp.name}}</span>
        </el-form-item>
        <el-form-item label="价格(Unit)">
          <span>{{dapp.price}}</span>
        </el-form-item>
        <el-form-item label="说明">
          <span>{{dapp.desc}}</span>
        </el-form-item>
        <el-form-item label="状态">
          <span>{{dapp.status}}</span>
        </el-form-item>
        <el-form-item label="ID">
          <span>{{dapp.tokenId}}</span>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleBuy">立即购买</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    dapp() {
      const { query } = this.$route;
      return query;
    },
  },
  data() {
    return {
      loading:false
    }
  },
  methods: {
    handleBuy() {
      this.loading = true
      this.$Nft.NFT_Buy(
        this.dapp.tokenId,
        (res)=>{
          this.loading = false
          if(res.code === 0){
            this.$message.success('购买成功')
          }else {
            this.$message.error(res.msg);
          }
        }
      )
    }
  },
};
</script>

<style lang="less">
.page-project-detail {
  background-color: #ffffff;
  width: 80%;
  margin: 0 auto;
  height: 500px;
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .project-icon {
    width: 300px;
    height: 420px;
    margin-left: 140px;
    >img {
      width: 100%;
      height: 100%;
    }
  }
  .project-info {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
</style>
