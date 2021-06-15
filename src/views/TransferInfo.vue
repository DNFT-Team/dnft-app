<template>
  <div class="full-width">
    <div class="title-sticky">
      <span class="title">Trade</span>
      <vs-button :to="{name: back}" type="flat" color="#1B2559" icon="arrow_back" style="margin:0 1rem"></vs-button>
    </div>
    <el-row :gutter="10" class="card-goods">
      <el-col :span="12">
        <el-image class="radius-12 album" :src="goods.src" fit="contain" :preview-src-list="[goods.src]" lazy>
          <div slot="placeholder" class="img-place flex-cen">
            <vs-icon icon="photo_size_select_actual" size="40px"></vs-icon>
          </div>
          <div slot="error" class="img-place flex-cen">
            <div>
              <vs-icon icon="photo_size_select_actual" size="40px" color="danger"></vs-icon>
            </div>
            <p>Load Failed</p>
          </div>
        </el-image>
      </el-col>
      <el-col :span="12">
        <vs-card style="padding: .8rem;">
          <div class="flex-btw">
            <div>
              <span class="title"> # {{goods.name}}</span>
              <p style="font-size: 24px;color:#2C386F;"> Owner: {{goods.owner}}</p>
            </div>
            <span style="color: #B9A2FF">
            <vs-icon icon="favorite" color="#B9A2FF"></vs-icon>
            {{goods.favor}}
          </span>
          </div>
          <p class="title">Introduction</p>
          <section style="font-weight: 300;font-size: 18px;line-height: 21px;color: #68769F;">To commemorate the Conflux Network's success as the third-largest decentralized...</section>
          <p class="title">Hash</p>
          <section style="color: #68769F;">wuwghdisauhiusahiugfpiqughdpasudiusahdiusagiudgasipudgisaudjsah</section>
          <p class="title">Price</p>
          <div style="font-weight: bold;font-size: 24px;line-height: 29px;">
            <span style="color: #253EF3;">{{goods.price}} $ETH</span>
            <el-divider direction="vertical"/>
            <span style="color: #68769F;">$ 344</span>
          </div>
          <vs-button @click="handleBought" style="width: 40%;margin-top: 1rem" type="gradient" color="primary">Buy Now</vs-button>
        </vs-card>
      </el-col>
    </el-row>
    <Gallery title="Recommend" :ds="data_hs"/>
  </div>
</template>

<script>
  import Gallery from "../components/Gallery";

  export default {
    name: "TransferInfo",
    components: {Gallery},
    created() {
      this.data_hs = new Array(4).fill(1).map((e, i) => ({
        id: i,
        name: 'ShanghaiBar',
        owner: 'Billy',
        price: 1.25,
        favor: 100,
        src: `/img/home/${i + 5}.png`,
        recycle: new Date('2021-08-01 00:00:00')
      }))
      this.getGoodParam()
    },
    data() {
      return {
        back: 'Home',
        goods: {
          id: 1,
          name: 'ShanghaiBar',
          owner: 'Billy',
          price: 1.25,
          favor: 100,
          src: `/img/home/6.png`,
          recycle: new Date('2021-08-01 00:00:00')
        },
        data_hs: []
      }
    },
    methods: {
      getGoodParam() {
        let {back, goods} = this.$route.params
        back = (back && back !== 'Transfer' )? back :'Home'
        if (!goods) {
          this.$router.push({name:back})
        } else {
          console.log(goods,back);
          this.back = back
          goods.src = `https://unsplash.it/300/280?random=${goods.hash}`
          this.goods = goods
        }
      },
      handleBought(){
        this.$vs.notify({
          title: 'Bought Success',
          text: 'Lorem ipsum dolor sit amet, consectetur',
          color: 'primary'
        })
        setTimeout(()=>{
          this.$router.push({name:this.back})
        },2000)
      }
    }
  }
</script>

<style scoped lang="less">
.card-goods{
  margin: 2rem 0;
  padding: 2rem;
  background: #F6F8FD;
  border-radius: 10px;
  max-height: 600px;
  .album{
    max-height: 500px;
    height: 80%;
    width: 100%;
  }
  .img-place{
    height: 500px;
    width: 500px;
    flex-direction: column;
    border-radius: 20px;
    background: #E1E9F8;
  }
}
</style>
