<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <div>
        <vs-button :to="{name:'AI'}">Back</vs-button>
        <strong style="margin-left: 1rem;">AI.Detial</strong>
      </div>
    </div>
    <div class="card-wrap info-card">
      <h3>Item</h3>
      <div class="info-box">
        <p>
          <label>Created By: </label>
          <span>{{item.creator}}</span>
        </p>
        <p>
          <label>Created At: </label>
          <span>{{item.timestamp|timeFormat}}</span>
        </p>
        <p>
          <label>Starts : </label>
          <span>{{item.stars}}</span>
        </p>
        <p>
          <label>Tags : </label>
        </p>
        <div style="overflow: hidden;">
          <template v-if="'data'===aiType">
            <vs-chip transparent color="primary">
              {{item.industry}}
            </vs-chip>
            <vs-chip transparent color="warning">
              {{item.resource}}
            </vs-chip>
            <vs-chip transparent color="success">
              {{item.technology}}
            </vs-chip>
          </template>
          <template v-if="'model'===aiType">
            <vs-chip transparent color="primary">
              {{item.language}}
            </vs-chip>
            <vs-chip transparent color="warning">
              {{item.framwork}}
            </vs-chip>
          </template>
        </div>
      </div>
    </div>
    <div class="card-wrap bound-card">
        <h3>Boundary</h3>
        <div style="margin: 1rem 0;">
          <strong>Single NFT :</strong>
          <span v-if="item.nft_id">
            {{item.nft_id}}
          </span>
          <vs-button v-else @click="boundSingle" color="danger" type="line" style="margin-left: 1rem;">+ Bound Now
          </vs-button>
        </div>
      <div style="margin: 1rem 0;">
        <strong>Multi Collection :</strong>
        <span v-if="item.collection_id">
            {{item.collection_id}}
          </span>
        <vs-button v-else @click="boundMulti" color="danger" type="line" style="margin-left: 1rem;">+ Bound Now
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ai-info',
  filters: {
    timeFormat(stamp) {
      return new Date(stamp * 1000).toLocaleString();
    },
  },
  data() {
    return {
      aiType: 'data',
      item: {},
    };
  },
  created() {
    const { ds, type } = this.$route.params;
    if (ds && type) {
      this.aiType = type;
      this.item = { ...ds };
    } else {
      this.$router.push({ name: 'AI' });
    }
  },
  methods: {
    boundSingle() {

    },
    boundMulti() {

    },
  },
};
</script>

<style scoped lang="less">
.info-card,
.bound-card{
  margin-top: 1rem;
  //min-height: 30vh;
  height: max-content;
  padding: .8rem;
  color: #11047A;
}
.info-box{
  p{
    margin: .6rem 0;
    label{
      margin-right: 1rem;
      opacity: 0.8;
      color: #B9A2FF;
    }
  }
}
</style>
