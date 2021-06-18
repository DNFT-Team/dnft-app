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
          if(!hash){
            this.$vs.notify({
              position:'top-center',
              title: 'System hint',
              text: 'NFT is not existed',
              color: 'danger'
            })
            this.$router.push({name: back || 'Home'})
          }else {
            this.$api.NFT_One(hash).then((res)=>{
              setTimeout(()=>{
                this.$router.push({
                  name: 'Transfer',
                  params: {
                    back,
                    goods: {
                      ...res,
                      hash:hash,
                      name: res.metadata,
                      src: res.data,
                      favor: 100,
                      recycle: new Date('2021-08-01 00:00:00')
                    }
                  }
                })
              },200)
            }).catch(()=>{
              this.$router.push({name: back || 'Home'})
            })
          }
        }
    }
</script>

<style scoped>

</style>
