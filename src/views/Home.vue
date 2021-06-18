<template>
    <div class="full-width">
      <el-divider content-position="left">
        <span class="title">NFT Gallery of the week</span>
      </el-divider>
      <el-carousel height="630px" indicator-position="outside" autoplay loop>
        <el-carousel-item v-for="(item, i) in data_carousel" :key="i" class="radius-12">
          <el-image class="full-height full-width" :src="item.src" fit="fill"></el-image>
        </el-carousel-item>
      </el-carousel>
      <Gallery title="Hot Sale" :ds="data_hs" />
      <Gallery title="Hot Recycle" :ds="data_hs" :cut="true"/>
      <Gallery title="Hot Data" :ds="data_hs" />
    </div>
</template>

<script>
import Gallery from "../components/Gallery";
export default {
  name: "Home",
  components:{Gallery},
  created() {
    this.data_hs = new Array(4).fill(1).map((e,i)=>({
      id:i,
      name: 'ShanghaiBar',
      owner: 'Billy',
      price:1.25,
      favor: 100,
      src: `/img/home/${i+5}.png`,
      recycle: new Date('2021-08-01 00:00:00')
    }))
  },
  data() {
    return {
      data_carousel : [
        {title: '',src:'/img/home/1.jpg'},
        {title: '',src:'/img/home/2.jpg'},
        {title: '',src:'/img/home/3.jpg'},
        {title: '',src:'/img/home/4.jpg'}
      ],
      data_hs : []
    }
  }
}
</script>

<style scoped lang="less">
</style>
