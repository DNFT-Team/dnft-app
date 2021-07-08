<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">NFT2006</span>
      <div>
        <vs-button @click="openPop" color="warning" type="line" size="large"
                   style="margin-left: 1rem;">+ CLASS
        </vs-button>
        <vs-button @click="openPop" color="danger" type="line" size="large"
                   style="margin-left: 1rem;">+ NFT
        </vs-button>
        <vs-button @click="openPop" color="primary" type="line" size="large"
                   style="margin-left: 1rem;">+ COL
        </vs-button>
      </div>
    </div>
    <vs-tabs alignment="fixed" style="margin-top: 1rem">
      <vs-tab label="CLASS" @click="getClassList">
        <vs-list>
          <vs-list-item v-for="cls in clsList" :key="cls.class_id" :title="cls.name" subtitle="Top Contributor">
            <template slot="avatar">
              <vs-avatar :src="cls.info"/>
            </template>
            <div>
              TOL: {{cls.total_supply}}
            </div>
          </vs-list-item>
        </vs-list>
      </vs-tab>
      <vs-tab label="NFT" @click="getNftList">
        <vs-list>
          <div v-for="nft in nftList" :key="nft.nft_id">
            <vs-list-header :title="'Class'+nft.nft_id" color="danger"></vs-list-header>
            <vs-list-item  :title="nft.name" :subtitle="`Price: ${nft.price}`">
              <template slot="avatar">
                <vs-avatar :src="nft.info"/>
              </template>
              <vs-button color="danger" type="gradient">Share</vs-button>
            </vs-list-item>
          </div>
        </vs-list>
      </vs-tab>
      <vs-tab label="COLLECTION" @click="getCollectionList">
        <vs-list>
          <div v-for="col in colList" :key="col.collection_id">
            <vs-list-header :title="col.name" color="primary"></vs-list-header>
            <vs-list-item  v-for="cnft in col.nft"
                           :key="col.collection_id+'-'+cnft.nft_id"
                           :title="cnft.name">
              <template slot="avatar">
                <vs-avatar :src="cnft.info"/>
              </template>
              <div>
                Price: {{cnft.price}}
              </div>
            </vs-list-item>
          </div>
        </vs-list>
      </vs-tab>
    </vs-tabs>

  </div>
</template>

<script>
export default {
  name: 'nft2006',
  data() {
    return {
      clsList: [],
      nftList: [],
      colList: [],
    };
  },
  mounted() {
    this.getClassList();
  },
  methods: {
    openPop() {},
    getClassList() {
      this.clsList = [1, 2, 3].map((e) => ({
        class_id: e, name: `Class-${e}`, info: `https://unsplash.it/300/280?random=${e}`, total_supply: Math.ceil(Math.random() * 10),
      }));
    },
    getNftList() {
      this.nftList = [1, 2, 3].map((e) => ({
        nft_id: e, name: `Nft-${e}`, info: `https://unsplash.it/300/280?random=${e}`, price: (Math.random() * 10).toFixed(2),
      }));
    },
    getCollectionList() {
      this.colList = [1, 2, 3].map((c) => ({
        collection_id: c,
        name: `Collection-${c}`,
        info: `https://unsplash.it/300/280?random=${c}`,
        nft: [1, 2, 3].map((e) => ({
          nft_id: e, name: `Nft-${e}`, info: `https://unsplash.it/300/280?random=${e}`, price: (Math.random() * 10).toFixed(2),
        })),
      }));
    },
  },
};
</script>

<style scoped>

</style>
