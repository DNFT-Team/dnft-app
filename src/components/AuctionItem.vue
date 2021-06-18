<template>
  <vs-card class="auction-wrapper" actionable >
    <div slot="header" class="flex-btw">
      <div class="left-state" :class="{'state-closed':item.state==='closed'}">
        <span class="state-dot"></span>
        <label>{{item.state}}</label>
      </div>
      <span>#{{item.index}}</span>
    </div>
    <div>
      <el-image class="mt-md radius-12 full-width" :src="item.src" fit="fill" lazy>
        <div slot="placeholder" class="img-place">
          <vs-icon icon="photo_size_select_actual" size="40px"></vs-icon>
        </div>
      </el-image>
      <p class="mt-md">《 {{item.name}} 》</p>
      <p class="mt-md">
        <label>Address: </label>
        <span>{{item.address}}</span>
      </p>
      <p class="mt-md">
        <label>Start:</label>
        <span>{{item.base}} $DNF</span>
      </p>
      <p class="mt-md">
        <label>Participants:</label>
        {{item.participants}}
      </p>
    </div>
    <div slot="footer">
      <vs-row vs-justify="flex-end">
        <vs-button color="danger" type="gradient" :to="{name: 'Bit',params:{goods:item}}">Bit</vs-button>
      </vs-row>
    </div>
  </vs-card>
</template>

<script>
  export default {
    name: "AuctionItem",
    props: {
      item: Object
    }
  }
</script>

<style scoped lang="less">
  .auction-wrapper {
    width: 100%;
    /*height: 100%;*/
    background: hsla(0, 0%, 100%, .13333333333333333);
    border-radius: 10px;
    color: white;

    .mt-md {
      margin-top: .8rem;
    }

    label {
      opacity: .6;
      margin-right: .4rem;
    }

    p {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .left-state {
      .state-dot {
        width: 10px;
        height: 10px;
        display: inline-block;
        border-radius: 5px;
        margin-right: .4rem;
        background: #abff52;
      }
    }

    .state-closed {
      .state-dot {
        background: #fff;
      }
    }
  }
</style>
