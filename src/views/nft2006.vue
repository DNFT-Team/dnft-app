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
          <vs-list-item v-for="cls in clsList" :key="cls.class_id"
                        :title="cls.name" :subtitle="cls.info">
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
              <vs-button color="danger" type="gradient" @click="nftFragmentation(nft)">
                Share
              </vs-button>
              <vs-button style="margin-left: 1rem;" v-show="nft.status==='Normal'"
                         color="success" type="gradient" @click="nftOffer(nft)">
                Offer
              </vs-button>
            </vs-list-item>
          </div>
        </vs-list>
      </vs-tab>
      <vs-tab label="COLLECTION" @click="getCollectionList">
        <vs-collapse type="margin" accordion>
          <vs-collapse-item  v-for="(col,n) in colList" :key="col.collection_id">
            <div slot="header">
              <h4 class="title">
                <vs-avatar :src="col.data"/>
                <span>#{{col.name}}</span>
              </h4>
            </div>
            <div style="padding: 2rem 1rem;">
              <section class="col-txt">
                <p> Info:{{col.info}}</p>
                <p> Price:{{col.price}}</p>
                <p> Owner:{{col.owner}}</p>
                <p> Issuer:{{col.issuer}}</p>
              </section>
              <el-row v-if="col.nfts&&col.nfts.length>0" :gutter="20" class="card-wrap">
                <el-col :span="6" v-for="nft in col.nfts" :key="nft.nft_id">
                  <vs-card actionable>
                    <div slot="header">{{nft.name}}</div>
                    <el-image class="radius-12 full-width" :src="nft.data" fit="contain" lazy>
                      <div slot="placeholder" class="img-place">
                        <vs-icon icon="photo_size_select_actual" size="40px"></vs-icon>
                      </div>
                    </el-image>
                  </vs-card>
                </el-col>
              </el-row>
              <vs-button v-else color="danger" type="relief"
                         @click="getNftByCol(n)">View NFTs
              </vs-button>
            </div>
          </vs-collapse-item>
        </vs-collapse>
      </vs-tab>
      <vs-tab label="FRAGMENT" @click="getClsList">
        <vs-list>
          <vs-list-item v-for="cls in clsList" :key="cls.class_id"
                        :title="cls.name" :subtitle="cls.info">
            <template slot="avatar">
              <vs-avatar :src="cls.data"/>
            </template>
            <div>
              TOL: {{cls.total_supply}}
            </div>
          </vs-list-item>
        </vs-list>
      </vs-tab>
    </vs-tabs>
    <vs-popup title="Create" :active.sync="activePrompt">
      <div style="padding: 1rem .6rem;">
        <template v-if="promptType==='collection'">
          <h4>Create Collection</h4>
          <div>
            <vs-select
              color="primary"
              label="Select NFT"
              class="full-width"
              v-model="formData.nfts"
              max-selected="5"
              multiple
            >
              <vs-select-item :key="item.nft_id" :value="n" :text="item.name"
                              v-for="(item,n) in nftList"/>
            </vs-select>
            <vs-input class="full-width" label="Name" v-model="formData.name" />
            <vs-input class="full-width" label="Info" v-model="formData.info" />
            <vs-input-number label="Price" :min="0" v-model="formData.price"/>
            <vs-upload action="https://jsonplaceholder.typicode.com/posts/" :limit="1" />
          </div>
          <div style="text-align: right;margin-top: 1rem;">
            <vs-button @click="createCol" color="primary" type="relief">Submit</vs-button>
          </div>
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
              label="Class"
              class="full-width"
              v-model="formData.class_id"
            >
              <vs-select-item :key="item.class_id" :value="item.class_id" :text="item.name"
                              v-for="item in clsList"/>
            </vs-select>
            <vs-input class="full-width" label="Name" v-model="formData.name" />
            <vs-input class="full-width" label="Info" v-model="formData.info" />
            <vs-input-number label="Price" :min="0" v-model="formData.price"/>
            <vs-upload action="https://jsonplaceholder.typicode.com/posts/" :limit="1" />
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
        data: null,
        total_supply: 0,
        price: 0,
        nfts: [],
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
        data: null,
        class_id: '',
        total_supply: 0,
        price: 0,
        nfts: [],
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
        this.$vs.loading({ color: '#11047A', type: 'radius' });
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
      }
    },
    createCol() {
      const {
        name, info, price = 0, nfts = [],
      } = this.formData;
      if (name && info && nfts.length > 0) {
        const nftSource = nfts.map((i) => (this.nftList[i]));
        const nftGroup = groupBy(nftSource, 'class_id');
        const nftIndex = Object.entries(nftGroup).map((ent) => ([
          ent[0], ent[1].length, ent[1].map((e) => e.index),
        ]));
        if (nftIndex.length <= 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Nft Not Find',
            color: 'warning',
          });
          return;
        }
        const dataStr = `https://unsplash.it/300/280?random=${Math.ceil(Math.random() * 100)}`;
        this.$vs.loading({ color: '#11047A', type: 'radius' });
        BaseApi.signAndSend(
          'nft2006Module',
          'coupledCollection',
          (res) => {
            this.$vs.loading.close();
            if (res.code === 0) {
              this.activePrompt = false;
              this.$vs.notify({
                position: 'top-right',
                title: 'System Hint',
                text: 'Add Collection Success.',
                color: 'success',
              });
              this.getNFTList();
            }
          },
          stringToHex(name),
          stringToHex(info),
          stringToHex(dataStr),
          price * 1_0000,
          nftIndex,
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
    async getNftByCol(n) {
      const col = this.colList[n];
      let resData = [];
      try {
        this.$vs.loading({ color: '#11047A', type: 'radius' });
        const api = this.$store.state.chainState.Api;
        const queryCls = col.source.reduce((t, c) => {
          let temp = [];
          if (c.amount > 0 && c.nfts_indexs.length > 0) {
            temp = c.nfts_indexs.map((i) => [
              api.query.nft2006Module.nFTByClassIndex, [c.class_id, i],
            ]);
          }
          return [...t, ...temp];
        }, []);
        const nftIdsByCls = await api.queryMulti(queryCls);
        const nominatorIds = nftIdsByCls.map((e) => e.value.toString());
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
        this.colList[n].nfts = [...resData];
        this.$vs.loading.close();
      }
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
        this.nftList = resData.filter((e) => (e.status !== 'InColletion') && (e.issuer === this.$store.state.address));
      }
    },
    async getCollectionList() {
      let resData = [];
      try {
        const api = this.$store.state.chainState.Api;
        const keys = await api.query.nft2006Module.collections.keys();
        const nominatorIds = keys.map(({ args: [nominatorId] }) => nominatorId);
        // console.log('all nominators:', nominatorIds.map((e) => e.toString()));
        const multiQuery = await api.query.nft2006Module.collections.multi(nominatorIds);
        resData = multiQuery.map((e, i) => {
          const temp = e.value.toJSON();
          return {
            ...temp,
            collection_id: nominatorIds[i].toString() || '',
            name: hexToString(temp.name),
            info: hexToString(temp.symbol),
            data: hexToString(temp.info),
            price: temp.price / 1_0000,
            nfts: [],
          };
        });
      } catch {
        resData = [];
      } finally {
        this.colList = resData.filter((e) => e.issuer === this.$store.state.address);
      }
    },
    getFullList() {
      this.getClsList();
      this.getNFTList();
      this.getCollectionList();
    },
  },
};
</script>

<style scoped>
.col-txt{
  background: #E0E5F2;margin-bottom: 1rem;padding: .8rem;border-radius: 15px;
}
</style>
