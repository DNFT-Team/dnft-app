<template>
    <div class="full-width">
      <h2 class="title font-serif text-primary dark:text-white">NFT Gallery of the week</h2>
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
import Gallery from '../components/Gallery.vue';

export default {
  name: 'Home',
  components: { Gallery },
  created() {
    this.data_hs = new Array(4).fill(1).map((e, i) => ({
      id: i,
      name: 'ShanghaiBar',
      owner: 'Billy',
      price: 1.25,
      favor: 100,
      src: `https://unsplash.it/300/280?random=${i + 20}`,
      recycle: new Date('2021-08-01 00:00:00'),
    }));
  },
  data() {
    return {
      data_carousel: [
        { title: '', src: 'https://unsplash.it/1080/860?random=14' },
        { title: '', src: 'https://unsplash.it/1080/860?random=19' },
        { title: '', src: 'https://unsplash.it/1080/860?random=18' },
        { title: '', src: 'https://unsplash.it/1080/860?random=15' },
      ],
      data_hs: [],
    };
  },
};
</script>

<style scoped lang="less">
</style>
