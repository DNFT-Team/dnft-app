<template>
  <div class="card-wrap shadow-inner bg-gray-200 dark:bg-gray-800">
    <div class="font-serif">
      <span class="title text-primary dark:text-white">{{title}}</span>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item,i) in ds" :key="i">
        <GoodsItem :item="item" :show-cut="cut"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GoodsItem from './GoodsItem.vue';

export default {
  name: 'Gallery',
  props: ['title', 'ds', 'cut'],
  components: { GoodsItem },
};
</script>

<style scoped>
</style>
