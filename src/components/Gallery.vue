<template>
  <div class="card-wrap">
    <div class="top-bar">
      <span class="title">{{title}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,i) in ds" :key="i">
        <GoodsItem :item="item" :show-cut="cut"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import GoodsItem from "./GoodsItem";

  export default {
    name: "Gallery",
    props: ['title', 'ds','cut'],
    components: {GoodsItem}
  }
</script>

<style scoped>
</style>
