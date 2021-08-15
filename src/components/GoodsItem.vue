<template>
  <vs-card class="text-blue-800 bg-white dark:text-white dark:bg-gray-600" actionable>
    <div slot="header" class="mg-line">
      <vs-chip v-if="showStatus" color="primary">
        {{item.status}}
      </vs-chip>
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
      <div class="mg-owner">Owner: {{item.owner}}</div>
      <div>{{item.price}} $DNF</div>
    </div>
    <div class="mg-line" v-if="showRecycle">
      <span>Recycle: {{item.recycle.toDateString()}}</span>
    </div>
    <div class="mg-line" v-if="showTax">
      <span>Tax: {{item.tax}}</span>
    </div>
    <div style="padding: 1rem 0;">
    </div>
    <div slot="footer">
      <vs-row vs-justify="flex-end">
        <vs-button v-if="!hideFavor" type="gradient" color="danger" icon="favorite"
                   style="margin-right: 1rem"></vs-button>
        <vs-button v-if="!hideBuy" :disabled="disBuy" :to="linkRoute" color="primary" icon="add_shopping_cart"></vs-button>
        <vs-button v-if="showTax" color="warning" icon="price_check" @click="$emit('tax',item)"></vs-button>
        <vs-button v-if="showOffer && item.status==='Normal'" color="primary" icon="local_offer" @click="$emit('offer',item)"></vs-button>
      </vs-row>
    </div>
  </vs-card>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    item: Object,
    showStatus: Boolean,
    showRecycle: Boolean,
    showTax: Boolean,
    showCut: Boolean,
    showOffer: Boolean,
    hideBuy: Boolean,
    hideFavor: Boolean,
    disBuy: Boolean,
  },
  computed: {
    linkRoute() {
      return {
        path: 'pending',
        query: {
          back: this.$route.name,
          hash: this.item.hash,
        },
      };
    },
  },
};
</script>

<style scoped>
  .mg-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }
  .mg-owner{
    width: 50%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
