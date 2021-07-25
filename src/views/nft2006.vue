<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">NFT2006</span>
      <div>
        <vs-button @click="openPop('class')" color="warning" type="line" size="large"
                   style="margin-left: 1rem;">+ CLASS
        </vs-button>
        <vs-button @click="openPop('nft')" color="danger" type="line" size="large"
                   style="margin-left: 1rem;">+ NFT
        </vs-button>
        <vs-button @click="openPop('collection')" color="primary" type="line" size="large"
                   style="margin-left: 1rem;">+ COL
        </vs-button>
      </div>
    </div>
    <vs-tabs alignment="fixed" style="margin-top: 1rem">
      <vs-tab label="CLASS" @click="getClsList">
        <vs-list>
          <vs-list-item v-for="cls in clsList" :key="cls.class_id" :title="cls.name" :subtitle="cls.info">
            <template slot="avatar">
              <vs-avatar :src="cls.data"/>
            </template>
            <div>
              TOL: {{cls.total_supply}}
            </div>
          </vs-list-item>
        </vs-list>
      </vs-tab>
      <vs-tab label="NFT" @click="getNFTList">
        <vs-list>
          <div v-for="(v,k) in nftGroup" :key="k">
            <vs-list-header :title="'Class-'+(clsMap[k].name || k)" color="danger"></vs-list-header>
            <vs-list-item v-for="nft in v" :key="nft.nft_id"
                          :title="nft.name" :subtitle="`Price: ${nft.price}`">
              <template slot="avatar">
                <vs-avatar :src="nft.data"/>
                <vs-chip color="warning">{{nft.status}}</vs-chip>
              </template>
              <vs-button color="danger" type="gradient" @click="nftFragmentation(nft)">Share</vs-button>
              <vs-button style="margin-left: 1rem;" v-show="nft.status==='Normal'"
                         color="success" type="gradient" @click="nftOffer(nft)">
                Offer
              </vs-button>
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
    <vs-popup title="Create" :active.sync="activePrompt">
      <div style="padding: 1rem .6rem;">
        <template v-if="promptType==='collection'">
          <div>col</div>
        </template>
        <template v-else-if="promptType==='class'">
          <h4>Create Class</h4>
          <div>
            <vs-input class="full-width" label="Name" v-model="formData.name" />
            <vs-input class="full-width" label="Info" v-model="formData.info" />
            <vs-input-number label="Total Supply" :min="0" :max="1000"
                             v-model="formData.total_supply"/>
          </div>
          <div style="text-align: right;margin-top: 1rem;">
            <vs-button @click="createCls" color="primary" type="relief">Submit</vs-button>
          </div>
        </template>
        <template v-else-if="promptType==='nft'">
          <h4>Create NFT2006</h4>
          <div>
            <vs-select
              color="primary"
              label="Existed"
              class="full-width"
              v-model="formData.class_id"
            >
              <vs-select-item :key="item.class_id" :value="item.class_id" :text="item.name"
                              v-for="item in clsList"/>
            </vs-select>
            <vs-input class="full-width" label="Name" v-model="formData.name" />
            <vs-input class="full-width" label="Info" v-model="formData.info" />
            <vs-input-number label="Price" :min="0" v-model="formData.price"/>
            <vs-upload action="https://jsonplaceholder.typicode.com/posts/" single-upload :data="formData.data"/>
          </div>
          <div style="text-align: right;margin-top: 1rem;">
            <vs-button @click="createNFT" color="primary" type="relief">Submit</vs-button>
          </div>
        </template>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import { stringToHex, hexToString } from '@polkadot/util';
import { groupBy, keyBy } from 'lodash';
import BaseApi from '../api/baseApi';

export default {
  name: 'nft2006',
  data() {
    return {
      isLoad: false,
      activePrompt: false,
      promptType: 'class',
      formData: {
        name: '',
        info: '',
        data: '',
        total_supply: 0,
        price: 0,
      },
      clsList: [],
      nftList: [],
      colList: [],
    };
  },
  computed: {
    chainOk() {
      return this.$store.state.chainState.Api && this.$store.state.chainState.isConnected;
    },
    nftGroup() {
      return groupBy(this.nftList || [], 'class_id');
    },
    clsMap() {
      return keyBy(this.clsList || [], 'class_id');
    },
  },
  watch: {
    chainOk(bool) {
      bool && !this.isLoad && this.getFullList();
    },
    '$store.state.address': {
      handler() {
        this.getFullList();
      },
    },
  },
  mounted() {
    this.getFullList();
  },
  methods: {
    openPop(promptType) {
      this.formData = {
        name: '',
        info: '',
        data: '',
        class_id: '',
        total_supply: 0,
        price: 0,
      };
      this.activePrompt = true;
      this.promptType = promptType;
    },
    createCls() {
      const { name, info, total_supply } = this.formData;
      if (name && info && total_supply) {
        const metaData = JSON.stringify({ name, info });
        const dataStr = `https://unsplash.it/300/280?random=${Math.ceil(Math.random() * 100)}`;

        this.$vs.loading({ color: '#11047A', type: 'radius' });
        BaseApi.signAndSend(
          'nft2006Module',
          'createClass',
          (res) => {
            this.$vs.loading.close();
            if (res.code === 0) {
              this.activePrompt = false;
              this.$vs.notify({
                position: 'top-right',
                title: 'System Hint',
                text: 'Add Class Success.',
                color: 'success',
              });
              this.getClsList();
            }
          },
          stringToHex(metaData),
          stringToHex(dataStr),
          total_supply,
        ).catch((err) => {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: err.message,
            color: 'danger',
          });
          this.$vs.loading.close();
        });
      }
    },
    createNFT() {
      const {
        name, info, class_id, price = 0,
      } = this.formData;
      if (name && info && class_id) {
        const metaData = JSON.stringify({ name, info });
        const dataStr = `https://unsplash.it/300/280?random=${Math.ceil(Math.random() * 100)}`;

        BaseApi.signAndSend(
          'nft2006Module',
          'mintNft',
          (res) => {
            this.$vs.loading.close();
            if (res.code === 0) {
              this.activePrompt = false;
              this.$vs.notify({
                position: 'top-right',
                title: 'System Hint',
                text: 'Add NFT Success.',
                color: 'success',
              });
              this.getNFTList();
            }
          },
          class_id,
          stringToHex(dataStr),
          stringToHex(metaData),
          price * 1_0000,
        ).catch((err) => {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: err.message,
            color: 'danger',
          });
          this.$vs.loading.close();
        });
        this.$vs.loading({ color: '#11047A', type: 'radius' });
      }
    },
    nftOffer(nft) {
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      BaseApi.signAndSend(
        'nft2006Module',
        'offerNft',
        (res) => {
          this.$vs.loading.close();
          if (res.code === 0) {
            this.activePrompt = false;
            this.$vs.notify({
              position: 'top-right',
              title: 'System Hint',
              text: 'Offer Success.',
              color: 'success',
            });
            this.getNFTList();
          }
        },
        nft.nft_id,
        nft.price * 1_0000,
      ).catch((err) => {
        this.$vs.notify({
          position: 'top-right',
          title: 'System Hint',
          text: err.message,
          color: 'danger',
        });
        this.$vs.loading.close();
      });
    },
    nftFragmentation(nft) {
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      BaseApi.signAndSend(
        'nft2006Module',
        'nftFragmentation',
        (res) => {
          this.$vs.loading.close();
          if (res.code === 0) {
            this.activePrompt = false;
            this.$vs.notify({
              position: 'top-right',
              title: 'System Hint',
              text: 'Fragment Success.',
              color: 'success',
            });
            // this.getClsList();
          }
        },
        nft.nft_id,
        100_0000,
        stringToHex(`${nft.name}-Fragment`),
      ).catch((err) => {
        this.$vs.notify({
          position: 'top-right',
          title: 'System Hint',
          text: err.message,
          color: 'danger',
        });
        this.$vs.loading.close();
      });
    },
    async getClsList() {
      let resData = [];
      try {
        const api = this.$store.state.chainState.Api;
        const keys = await api.query.nft2006Module.classInfos.keys();
        const nominatorIds = keys.map(({ args: [nominatorId] }) => nominatorId);
        // console.log('all nominators:', nominatorIds.map((e) => e.toString()));
        const multiQuery = await api.query.nft2006Module.classInfos.multi(nominatorIds);
        resData = multiQuery.map((e, i) => {
          const temp = e.value.toJSON();
          const metaData = JSON.parse(hexToString(temp.name));
          return {
            ...temp,
            class_id: nominatorIds[i].toString() || '',
            name: metaData.name,
            info: metaData.info,
            data: hexToString(temp.info),
          };
        });
      } catch {
        resData = [];
      } finally {
        this.clsList = resData.filter((e) => e.issuer === this.$store.state.address);
      }
    },
    async getNFTList() {
      let resData = [];
      try {
        const api = this.$store.state.chainState.Api;
        const keys = await api.query.nft2006Module.nFTInfos.keys();
        const nominatorIds = keys.map(({ args: [nominatorId] }) => nominatorId);
        // console.log('all nominators:', nominatorIds.map((e) => e.toString()));
        const multiQuery = await api.query.nft2006Module.nFTInfos.multi(nominatorIds);
        resData = multiQuery.map((e, i) => {
          const temp = e.value.toJSON();
          const metaData = JSON.parse(hexToString(temp.metadata));
          return {
            ...temp,
            nft_id: nominatorIds[i].toString() || '',
            name: metaData.name,
            info: metaData.info,
            data: hexToString(temp.info),
            price: temp.price / 1_0000,
          };
        });
      } catch {
        resData = [];
      } finally {
        this.nftList = resData.filter((e) => e.issuer === this.$store.state.address);
      }
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
    getFullList() {
      this.getClsList();
      this.getNFTList();
    },
  },
};
</script>

<style scoped>

</style>
