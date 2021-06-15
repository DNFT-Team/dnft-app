<template>
  <div>
    Fetching
  </div>
</template>

<script>
    export default {
        name: "TransferPending",
        mounted() {
          const {back, hash} = this.$route.query
          setTimeout(()=>{
            this.$router.push({
              name: 'Transfer',
              params: {
                back,
                goods: {
                  id: hash,
                  name: 'ShanghaiBar',
                  owner: 'Billy',
                  price: 1.25,
                  favor: 100,
                  src: `/img/home/6.png`,
                  recycle: new Date('2021-08-01 00:00:00')
                }
              }
            })
          },200)
          // this.$router.push({name: back || 'Home'})
        }
    }
</script>

<style scoped>

</style>
