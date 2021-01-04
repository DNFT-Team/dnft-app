<template>
  <div class="layout-container">
    <header-view></header-view>
    <content-view></content-view>
  </div>
</template>

<script>
import HeaderView from './Header.vue';
import ContentView from './Content.vue';

export default {
  name: 'Layout',
  components: {
    HeaderView,
    ContentView,
  },
};
</script>

<style lang="less">
.layout-container {

}
</style>
