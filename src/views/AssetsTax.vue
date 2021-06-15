<template>
  <div class="full-width">
    <div class="card-wrap">
      <p class="title">Assets</p>
      <div class="card-wrap balance-card">
        <p>Total Balance</p>
        <div class="balance-txt">
          <img src="/img/logo.png" alt="dnft">
          <p>
            <span>{{balance}}</span>
            <span>$DNF</span>
          </p>
        </div>
      </div>
    </div>
    <vs-tabs :color="colorx" alignment="fixed">
      <vs-tab @click="colorx='success'" label="Owned" class="tab-row">
        <el-row v-if="data_hs.length>0" :gutter="20" class="card-wrap">
          <el-col :span="6" v-for="(item,i) in data_hs" :key="i">
            <GoodsItem :item="item" show-recycle hide-buy hide-favor/>
          </el-col>
        </el-row>
        <Empty v-else/>
        <div class="card-wrap add-card inner-card">
          Create Your Own NFT As Easy as 1,2,3
          <vs-button @click="openPopUp" color="primary" type="relief" size="large"
                     style="margin-left: 1rem;">Create
          </vs-button>
        </div>
      </vs-tab>
      <vs-tab @click="colorx='danger'" label="Favor" class="tab-row">
        <el-row v-if="data_hs.length>0" :gutter="20" class="card-wrap">
          <el-col :span="6" v-for="(item,i) in data_hs" :key="i">
            <GoodsItem :item="item" :show-recycle="true"/>
          </el-col>
        </el-row>
        <Empty v-else/>
      </vs-tab>
      <vs-tab @click="colorx='warning'" label="Tax" class="tab-row">
        <el-row v-if="data_hs.length>0" :gutter="20" class="card-wrap">
          <el-col :span="6" v-for="(item,i) in data_hs" :key="i">
            <GoodsItem :item="item" :show-recycle="true" hide-favor hide-buy/>
          </el-col>
        </el-row>
        <Empty v-else/>
        <div class="card-wrap tax-card inner-card" v-show="data_hs.length>0">
          Total: {{data_hs.length}} * 1 $DNF
          <vs-button @click="handleTax" color="primary" type="relief" size="large"
                     style="margin-left: 1rem;">Tax
          </vs-button>
        </div>
      </vs-tab>
    </vs-tabs>
    <vs-popup title="Create NFT" :active.sync="activePrompt">
      <div style="padding: 1rem .6rem;">
        <el-steps :active="step" :space="200" finish-status="success" align-center>
          <el-step title="Series" description="Chose Series"></el-step>
          <el-step title="Generate" description="Create NFT"></el-step>
          <el-step title="Publish" description="Publish NFT"></el-step>
        </el-steps>
        <el-tabs :value="stepStr">
          <el-tab-pane label="Step1" name="s1" disabled>
            <el-form :model="formSeries" label-width="80px">
              <el-divider>Select Existed Series</el-divider>
              <vs-select
                color="primary"
                label="Existed"
                v-model="formSeries.hash"
              >
                <vs-select-item :key="index" :value="item.hash" :text="item.name"
                                v-for="(item,index) in seriesList"/>
              </vs-select>
              <el-divider>Or Create New Series</el-divider>
              <el-form-item label="Name">
                <el-input v-model="formSeries.name"></el-input>
              </el-form-item>
              <el-form-item label="Amount">
                <el-input type="number" v-model="formSeries.amount"></el-input>
              </el-form-item>
              <el-form-item label="Describe">
                <el-input type="textarea" v-model="formSeries.desc"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!formSeries.hash" style="float: right" color="primary"
                           @click="handleNext(1)">Next
                </el-button>
                <el-button style="float: right" color="primary" @click="addSeries">Submit
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Step2" name="s2" disabled>
            <el-form :model="formNFT" label-width="80px">
              <el-divider>Select Existed NFT</el-divider>
              <vs-select
                color="primary"
                label="Existed"
                v-model="formNFT.hash"
              >
                <vs-select-item :key="index" :value="item.hash" :text="item.name"
                                v-for="(item,index) in nftList"/>
              </vs-select>
              <el-divider>Or Create New NFT</el-divider>
              <el-form-item label="Name">
                <el-input v-model="formNFT.name"></el-input>
              </el-form-item>
              <el-form-item label="Category">
                <el-input :value="formNFT.categoryHash" readonly></el-input>
              </el-form-item>
              <el-form-item label="Price">
                <el-input type="number" v-model="formNFT.price"></el-input>
              </el-form-item>
              <el-form-item label="Describe">
                <el-input type="textarea" v-model="formNFT.desc"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :disabled="!formNFT.hash" style="float: right" color="primary"
                           @click="handleNext(2)">Next
                </el-button>
                <el-button style="float: right" color="primary" @click="addNFT">Submit</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Step3" name="s3" disabled>
            <el-form :model="formNFT" label-width="80px">
              <el-divider>Publish NFT</el-divider>
              <el-form-item label="Name">
                <el-input :value="formNFT.name" readonly></el-input>
              </el-form-item>
              <el-form-item label="Category">
                <el-input :value="formNFT.categoryHash" readonly></el-input>
              </el-form-item>
              <el-form-item label="Describe">
                <el-input type="textarea" :value="formNFT.desc" readonly></el-input>
              </el-form-item>
              <el-form-item label="Price">
                <el-input type="number" v-model="formNFT.price"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="float: right" color="primary" @click="publishNFT">Publish
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </vs-popup>
  </div>
</template>

<script>
  import GoodsItem from "./../components/GoodsItem";
  import Empty from "../components/Empty";

  export default {
    name: "AssetsTax",
    components: {GoodsItem, Empty},
    created() {
      const ran = Math.random() * 20
      this.data_hs = new Array(20).fill(1).map((e, i) => ({
        id: i,
        name: 'ShanghaiBar',
        owner: 'Billy',
        price: 1.25,
        favor: 100,
        src: `https://unsplash.it/300/280?random=${Math.ceil(i + ran)}`,
        recycle: new Date('2021-08-01 00:00:00')
      }))
    },
    computed:{
      stepStr(){
        return `s${this.step + 1}`
      }
    },
    data() {
      return {
        activePrompt: false,
        step: 0,
        formSeries: {
          name: '',
          desc: '',
          hash: '',
          amount: 0
        },
        formNFT: {
          name: '',
          desc: '',
          hash: '',
          categoryHash: '',
          price: 0
        },
        seriesList: [
          {name: 'SeriesA', hash: 'hashA'},
          {name: 'SeriesB', hash: 'hashB'},
        ],
        nftList: [
          {name: 'NFTA', hash: 'hashA'},
          {name: 'NFTB', hash: 'hashB'},
        ],
        balance: 25418,
        colorx: 'success',
        data_hs: []
      }
    },
    methods: {
      openPopUp() {
        this.step = 0;
        this.activePrompt = true
        this.formSeries = {
          name: '',
          desc: '',
          hash: '',
          amount: 0
        }
        this.formNFT = {
          name: '',
          desc: '',
          hash: '',
          categoryHash: '',
          price: 0
        }
      },
      handleNext(step) {
        switch (step) {
          case 1:
            if (this.formSeries.hash) {
              this.formNFT.categoryHash = this.formSeries.hash
              this.step = 1
            }
            break;
          case 2:
            if (this.formSeries.hash) {
              this.step = 2
            }
            break;
          default:
            break;
        }
      },
      addSeries() {
        this.formSeries = {
            name: 'Namexxxxxx',
            desc: 'xxxxxx',
            hash: 'xxxxxxhash',
            amount: 10
        }
        this.$vs.notify({
          title: 'System Hint',
          text: 'Add Series Success',
          color: 'success'
        })
      },
      addNFT() {
        this.formNFT = {
          name: 'Namexxxxxx',
          desc: 'xxxxxxx',
          hash: 'xxxxxhash',
          categoryHash: 'xxxxxhash',
          price: 10
        }
        this.$vs.notify({
          title: 'System Hint',
          text: 'Add NFT Success',
          color: 'success'
        })
      },
      publishNFT() {
        setTimeout(() => {
          this.activePrompt = false
          this.$vs.notify({
            title: 'Create Success',
            text: 'Lorem ipsum dolor sit amet, consectetur',
            color: 'success'
          })
        })
      },
      handleTax() {
        this.data_hs = []
        this.$vs.notify({
          title: 'Tax Success',
          text: 'Lorem ipsum dolor sit amet, consectetur',
          color: 'success'
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .balance-card {
    background: #396afc; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #2948ff, #396afc); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #2948ff, #396afc); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: white;

    .balance-txt {
      margin-top: 1rem;
      font-size: 40px;
      font-weight: 900;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      img {
        margin-right: 2rem;
      }
    }
  }

  .tab-row {
    position: relative;
    padding-bottom: 10rem;

    .inner-card {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      width: max-content;
      padding: 2rem;
      color: white;
      text-align: right;
      z-index: 3000;
      font-size: 26px;
      font-weight: 900;
    }
  }

  .add-card {
    background: #11998e; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #38ef7d, #11998e); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .tax-card {
    background: #FF8008; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #FFC837, #FF8008); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #FFC837, #FF8008); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

</style>
