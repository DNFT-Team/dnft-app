<template>
  <div class="full-width">
    <div class="title-sticky">
      <span class="title">Bit</span>
      <vs-button :to="{name: 'Auction'}" type="flat" color="#1B2559" icon="arrow_back"
                 style="margin:0 1rem"></vs-button>
    </div>
    <el-row :gutter="20" class="auction-row">
      <el-col :span="8" class="left-info">
        <div class="left-state" :class="{'state-closed':item.state==='closed'}">
          <span class="state-dot"></span>
          <label>{{item.state}}</label>
        </div>
        <h2>{{item.ddl}}</h2>
        <h2># {{item.name}}</h2>
        <label>Creator</label>
        <div class="row">{{item.creator}}</div>
        <label>Owner</label>
        <div class="row">{{item.owner}}</div>
        <label>Start Price</label>
        <div class="row">{{item.base}} $DNF</div>
        <label>Your Effective Bid</label>
        <div class="row">0 $DNF</div>
        <vs-button class="full-width" color="danger" type="gradient" size="large">Bit Now
        </vs-button>
      </el-col>
      <el-col :span="16">
        <div class="right-detail">
          <div class="right-normal right-detail-img" :class="{ 'img-animate':inAnimate,'right-hide': rightTab==='info'}" @click="handleSwitch('img')">
            <el-image class="radius-12 " :src="item.src" fit="contain" lazy>
              <div slot="placeholder" class="img-place">
                <vs-icon icon="photo_size_select_actual" size="40px"></vs-icon>
              </div>
            </el-image>
            <vs-icon v-show="rightTab==='info'" class="right-icon" icon="photo_size_select_actual" size="40px"></vs-icon>
          </div>
          <div class="right-normal right-detail-info" :class="{'info-animate':inAnimate,'right-hide': rightTab==='img'}" @click="handleSwitch('info')">
            <label>Contract Address:</label>
            <p>{{item.contract}}</p>
            <label>Token:</label>
            <p>{{item.token}}</p>
            <label>Description:</label>
            <p>{{item.desc}}</p>
            <vs-icon v-show="rightTab==='img'" class="right-icon" icon="info" size="40px"></vs-icon>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'AuctionInfo',
  data() {
    return {
      inAnimate: false,
      rightTab: 'img',
      item: {
        index: 0,
        name: '',
        desc: '',
        base: '',
        address: '',
        owner: '',
        creator: '',
        src: '',
        state: 'Open',
        participants: '',
      },
    };
  },
  methods: {
    handleSwitch(tab) {
      if (tab === this.rightTab) return;
      this.inAnimate = true;
      setTimeout(() => {
        this.rightTab = tab;
        this.inAnimate = false;
      }, 800);
    },
  },
  created() {
    const { goods } = this.$route.params;
    if (goods) {
      this.item = { ...goods };
    } else {
      this.$router.push({ name: 'Auction' });
    }
  },
};
</script>

<style scoped lang="less">
  .auction-row {
    margin: 2rem 0;
    padding: 2rem;
    background: #F6F8FD;
    border-radius: 10px;
    height: 600px;
    color: #11047A;

    .left-info {
      height: 100%;
      display: inline-flex;
      flex-flow: column;
      justify-content: space-around;
      align-items: flex-start;

      h2 {
        font-weight: bold;
      }

      label {
        opacity: .8;
        color: #B9A2FF;
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
          background: #8a8888;
        }
      }
    }

    .right-detail {
      position: relative;
      height: 500px;
      margin: 49px 10px 10px 49px;
      .right-normal{
        opacity: 1;
        background: #f5f5f5;
        box-shadow: 0 0 4px 2px #8a8888;
      }
      .right-detail-img {
        perspective: 2000px;
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        box-sizing: border-box;
        top: 0;
        left: 0;
        z-index: 9;
        display: flex;
        justify-content: center;
        align-items: center;
        .right-icon{
          position: absolute;
          right: 2%;
          bottom: 2%;
        }
      }
      .right-detail-info {
        position: absolute;
        width: 100%;
        height: 100%;
        top: -44px;
        left: -44px;
        z-index: 0;
        border-radius: 15px;
        padding: 67px 45px 81px;
        box-sizing: border-box;
        overflow: hidden;
        .right-icon{
          position: absolute;
          left: 2%;
          top: 2%;
        }
        label {
          opacity: .8;
          color: #B9A2FF;
        }
      }
      .img-animate{
        animation: imgMove ease-in-out .6s .2s;
      }
      .info-animate{
        animation: infoMove ease-in-out .6s .2s;
      }
      .right-hide{
        z-index: 0;
        background: #e3e4ed;
        box-shadow: 0 0 6px 3px #8a8888;
      }
    }
  }
  @keyframes imgMove {
    0%,100%{
      transform: translate(0,0);
      opacity: 1;
      z-index: 10;
    }
    50%{
      opacity: 0;
      transform: translate(-49px,0);
    }
  }
  @keyframes infoMove {
    0%,100%{
      transform: translate(0,0);
      opacity: 1;
    }
    50%{
      opacity: 0;
      transform: translate(49px,0);
    }
  }
</style>
