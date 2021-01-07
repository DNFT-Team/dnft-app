<template>
  <div class="project-card">
    <div class="card-icon">
      <img :src="dapp.icon" alt="">
    </div>
    <div class="card-bottom">
      <span class="card-bottom-name">{{dapp.name}}</span>
      <span class="card-bottom-desc">{{dapp.desc}}</span>
      <span class="card-bottom-desc">{{dapp.status}}</span>
      <span class="card-bottom-price">{{dapp.price}}Unit</span>
      <div class="card-bottom-btn" @click="handleBuy">查看详情</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dapp: {
      name: String,
      icon: String,
      desc: String,
      price: String,
      tokenId: String,
    },
  },
  mounted() {
    // console.log({ dapp: this.dapp });
  },
  methods: {
    handleBuy() {
      this.$router.push({ path: '/adetail', query: this.dapp });
    },
  },
};
</script>

<style lang="less">
.project-card {
  width: 261px;
  height: 383px;
  background-color: #ffffff;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .card-icon {
    width: 145px;
    height: 201px;
    padding: 7px;
    margin-top: 24px;
    box-shadow: 0px 3px 10px #89B4E8;
    >img {
      width: 100%;
      height: 100%;
    }
  }
  .card-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    &-name {
      font-size: 12px;
      line-height: 41px;
      font-weight: 600;
    }
    &-desc {
      font-size: 12px;
      line-height: 24px;
    }
    &-price {
      font-size: 15px;
      font-weight: 600;
    }
    &-btn {
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      background-color: #0A4F8B;
      height: 31px;
      line-height: 31px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
