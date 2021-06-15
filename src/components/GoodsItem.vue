<template>
  <vs-card style="background:#F6F8FD" actionable>
    <div slot="header" class="mg-line">
      <vs-chip v-if="showCut" color="danger">
        80% Cut
      </vs-chip>
      <span>{{item.name}}</span>
      <span style="color: #B9A2FF">
             <vs-icon icon="favorite" color="#B9A2FF"></vs-icon>
                {{item.favor}}
              </span>
    </div>
    <el-image class="radius-12 full-width" :src="item.src" fit="contain" lazy>
      <div slot="placeholder" class="img-place">
        <vs-icon icon="photo_size_select_actual" size="40px"></vs-icon>
      </div>
    </el-image>
    <el-divider />
    <div class="mg-line">
      <span>Owner: {{item.owner}}</span>
      <span>{{item.price}} ETH</span>
    </div>
    <div class="mg-line" v-if="showRecycle">
      <span>Recycle: {{item.recycle.toDateString()}}</span>
    </div>
    <div slot="footer">
      <vs-row vs-justify="flex-end">
        <vs-button v-if="!hideFavor" type="gradient" color="danger" icon="favorite"
                   style="margin-right: 1rem"></vs-button>
        <vs-button v-if="!hideBuy"  :to="linkRoute" color="primary" icon="add_shopping_cart"></vs-button>
      </vs-row>
    </div>
  </vs-card>
</template>

<script>
  export default {
    name: "GoodsItem",
    props: {
      item:Object,
      showRecycle:Boolean,
      showCut:Boolean,
      hideBuy: Boolean,
      hideFavor: Boolean
    },
    computed:{
        linkRoute(){
          return {
            path:'pending',
            query:{
              back: this.$route.name,
              hash: this.item.id
            }
          }
        }
    }
  }
</script>

<style scoped>
  .mg-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #1B2559;
  }

  .img-place {
    height: 280px;
    width: 280px;
    background: #E9EDF7;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
