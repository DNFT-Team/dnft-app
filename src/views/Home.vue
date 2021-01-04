<template>
  <div>
    <market></market>
  </div>
</template>

<script>
// @ is an alias to /src
import Market from '@/views/market/index.vue';

export default {
  name: 'Home',
  components: {
    Market,
  },
};
</script>
