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
          </p>
        </div>
      </div>
    </div>
    <vs-tabs :color="colorx" alignment="fixed">
      <vs-tab @click="fetchNft" label="Owned" class="tab-row">
        <el-row v-if="nftList.length>0" :gutter="20" class="card-wrap">
          <el-col :span="6" v-for="item in nftList" :key="nftList.hash">
            <GoodsItem :item="item" @offer="publishNFT" show-recycle show-status showOffer hide-buy
                       hide-favor/>
          </el-col>
        </el-row>
        <Empty v-else/>
        <div class="inner-card" style="width: 50%;">
          <vs-button
            style="float: right"
            radius
            color="primary"
            type="gradient"
            :icon="!creatShow?'add_circle':'indeterminate_check_box'"
            @click="creatShow=!creatShow"
          ></vs-button>
          <vs-tabs alignment="fixed" v-show="creatShow">
            <vs-tab label="NFT721">
              <div class="card-wrap add-card">
                Create Your Own NFT As Easy as 1,2,3
                <vs-button @click="openPopUp" color="primary" type="relief" size="large"
                           style="margin-left: 1rem;">Create
                </vs-button>
              </div>
            </vs-tab>
            <vs-tab label="NFT1155">
              <div class="card-wrap tax-card">
                NFT1155, The Most Popular Token
                <vs-button @click="openPopUp2" color="primary" type="relief" size="large"
                           style="margin-left: 1rem;">Create
                </vs-button>
              </div>
            </vs-tab>
            <vs-tab label="NFT2006">
              <div class="card-wrap nft-card">
                NFT2006, The New Generation Star
                <vs-button :to="{name:'nft2006'}" color="primary" type="relief" size="large"
                           style="margin-left: 1rem;">Skip to
                </vs-button>
              </div>
            </vs-tab>
          </vs-tabs>
        </div>
      </vs-tab>
      <vs-tab @click="colorx='danger'" label="Favor" class="tab-row">
        <el-row v-if="data_hs.length>0" :gutter="20" class="card-wrap">
          <el-col :span="6" v-for="(item,i) in data_hs" :key="i">
            <GoodsItem :item="item" :show-recycle="true" dis-buy/>
          </el-col>
        </el-row>
        <Empty v-else/>
      </vs-tab>
      <vs-tab @click="fetchNftTax" label="Tax" class="tab-row">
        <el-row v-if="taxList.length>0" :gutter="20" class="card-wrap">
          <el-col :span="6" v-for="(item,i) in taxList" :key="i">
            <GoodsItem :item="item" @tax="handleTaxOne" show-recycle showTax hide-favor hide-buy/>
          </el-col>
        </el-row>
        <Empty v-else/>
        <div class="card-wrap tax-card inner-card" v-show="taxList.length>0">
          Total: {{taxList.length}} * 1 $DNF
          <vs-button @click="handleTaxAll" color="primary" type="relief" size="large"
                     icon="done_all"
                     style="margin: 0 .4rem;">Tax/ALL
          </vs-button>
        </div>
      </vs-tab>
    </vs-tabs>
    <vs-popup title="Create NFT" :active.sync="activePrompt">
      <div style="padding: 1rem .6rem;">
        <el-steps :active="step" :space="200" finish-status="success" align-center>
          <el-step title="Series" description="Chose Class"></el-step>
          <el-step title="Generate" description="Create NFT"></el-step>
          <el-step title="Publish" description="Publish NFT"></el-step>
        </el-steps>
        <el-tabs :value="stepStr">
          <el-tab-pane label="Step1" name="s1" disabled>
            <el-form :model="formSeries" label-width="80px">
              <el-divider>Select Existed Class</el-divider>
              <vs-select
                color="primary"
                label="Existed"
                v-model="formSeries.hash"
              >
                <vs-select-item :key="index" :value="item.hash" :text="item.name"
                                v-for="(item,index) in seriesList"/>
              </vs-select>
              <el-divider>Or Create New Class</el-divider>
              <el-form-item label="Name">
                <el-input v-model="formSeries.name"></el-input>
              </el-form-item>
              <el-form-item label="Amount">
                <el-input type="number" v-model="formSeries.amount"></el-input>
              </el-form-item>
              <el-form-item label="Data">
                <el-upload
                  drag
                  action="https://jsonplaceholder.typicode.com/posts/">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
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
              <el-upload
                drag
                action="https://jsonplaceholder.typicode.com/posts/">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              </el-upload>
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
              <el-form-item label="New Price">
                <el-input type="number" v-model="formNFT.price"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button style="float: right" color="primary" @click="publishNFT(null)">Publish
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </vs-popup>
    <vs-popup title="Synthetize NFT" :active.sync="activePrompt2">
      <div style="padding: 1rem .6rem;">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px"
                 class="demo-dynamic">
          <el-form-item
            prop="name"
            label="Name"
            :rules="[{ required: true, message: 'Name is required', trigger: 'blur' }]"
          >
            <el-input v-model="dynamicValidateForm.name"/>
          </el-form-item>
          <el-form-item
            prop="price"
            label="Price"
          >
            <el-input-number v-model="dynamicValidateForm.price"/>
          </el-form-item>
          <el-form-item
            v-for="(nft, index) in dynamicValidateForm.part"
            :label="'Nft-' + index"
            :key="nft.hash"
            :prop="'part.' + index + '.value'"
            :rules="{required: true, message: 'Nft is required', trigger: 'blur'}"
          >
            <el-input v-model="nft.value"></el-input>
            <el-button @click.prevent="removeDomain(nft)">Remove</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')">Submit</el-button>
            <el-button @click="addNftRow">Add Nft</el-button>
            <el-button @click="resetForm('dynamicValidateForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import GoodsItem from '../components/GoodsItem';
import Empty from '../components/Empty';

export default {
  name: 'AssetsTax',
  components: { GoodsItem, Empty },
  data() {
    return {
      balance: 0,
      creatShow: true,
      colorx: 'primary',
      activePrompt: false,
      activePrompt2: false,
      step: 0,
      dynamicValidateForm: {
        part: [{
          value: '',
        }],
        price: 0,
        name: '',
      },
      formSeries: {
        name: '',
        hash: '',
        data: '',
        amount: 0,
      },
      formNFT: {
        name: '',
        hash: '',
        categoryHash: '',
        price: 0,
      },
      seriesList: [],
      nftList: [],
      nftClassList: [],
      data_hs: [],
      taxList: [],
    };
  },
  watch: {
    '$store.state.address': {
      handler(adr) {
        if (adr) {
          if (this.colorx === 'warning') {
            this.fetchNftTax();
          } else if (this.colorx === 'primary') {
            this.fetchNft();
          }
          this.$api.getBalance(adr).then((res) => {
            this.balance = res || 0;
          }).catch(() => {
            this.balance = 0;
          });
        } else {
          this.nftList = [];
          this.taxList = [];
          this.balance = 0;
        }
      },
    },
  },
  computed: {
    stepStr() {
      return `s${this.step + 1}`;
    },
  },
  methods: {
    openPopUp() {
      const { address } = this.$store.state;
      if (!address) {
        this.$vs.notify({
          position: 'top-center',
          title: 'System hint',
          text: 'Please connect wallet',
          color: 'warning',
        });
        return;
      }
      this.step = 0;
      this.activePrompt = true;
      this.fetchSeries();
      this.formSeries = {
        name: '',
        desc: '',
        hash: '',
        amount: 0,
      };
      this.formNFT = {
        name: '',
        desc: '',
        hash: '',
        categoryHash: '',
        price: 0,
      };
    },
    openPopUp2() {
      const { address } = this.$store.state;
      if (!address) {
        this.$vs.notify({
          position: 'top-center',
          title: 'System hint',
          text: 'Please connect wallet',
          color: 'warning',
        });
        return;
      }
      this.activePrompt2 = true;
      this.dynamicValidateForm = {
        part: [{
          value: '', hash: 0,
        }],
        price: 0,
        name: '',
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Submit',
            color: 'success',
          });
          this.activePrompt2 = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      const index = this.dynamicValidateForm.part.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.part.splice(index, 1);
      }
    },
    addNftRow() {
      this.dynamicValidateForm.part.push({
        value: '',
        hash: Date.now(),
      });
    },
    handleNext(step) {
      switch (step) {
        case 1:
          if (this.formSeries.hash) {
            this.formNFT.categoryHash = this.formSeries.hash;
            this.step = 1;
            this.fetchNftByClass(this.formSeries.hash);
          }
          break;
        case 2:
          if (this.formNFT.hash) {
            this.formNFT = this.nftList.find((e) => e.hash === this.formNFT.hash);
            this.step = 2;
          }
          break;
        default:
          break;
      }
    },
    fetchSeries() {
      const adr = this.$store.state.address;
      this.$api.Category_List().then((res) => {
        this.seriesList = (res || []).filter((e) => e.owner === adr).map((e) => ({
          name: e.name,
          hash: e.classId,
        }));
      }).catch(() => {
        this.seriesList = [];
      });
    },
    fetchNft() {
      this.colorx = 'primary';
      this.$api.NFT_List(this.$store.state.address).then((res) => {
        this.nftList = (res || []).map((e) => ({
          ...e,
          favor: 100,
          src: e.data,
          recycle: new Date('2021-08-01 00:00:00'),
          name: e.metadata,
          hash: e.tokenId,
        }));
      }).catch(() => {
        this.nftList = [];
      });
    },
    fetchNftByClass() {
      this.$api.NFT_Class_List(this.formNFT.categoryHash).then((res) => {
        this.nftClassList = (res || []).map((e) => ({
          ...e,
          favor: 100,
          src: e.data,
          recycle: new Date('2021-08-01 00:00:00'),
          name: e.metadata,
          hash: e.tokenId,
        }));
      }).catch(() => {
        this.nftClassList = [];
      });
    },
    fetchNftTax() {
      this.colorx = 'warning';
      this.$api.NFT_TaxList(this.$store.state.address).then((res) => {
        this.taxList = (res || []).map((e) => ({
          ...e,
          favor: 100,
          src: e.data,
          recycle: new Date('2021-08-01 00:00:00'),
          name: e.metadata,
          hash: e.tokenId,
        }));
      }).catch(() => {
        this.taxList = [];
      });
    },
    addSeries() {
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      this.$api.Category_Add({
        metaData: this.formSeries.name,
        amount: this.formSeries.amount,
        data: 'https://unsplash.it/300/280?random=1',
      }, (res) => {
        if (res.code === 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Add Class Success. Please Chose It Again',
            color: 'success',
          });
          this.fetchSeries();
        }
      }).catch((err) => {
        console.log('addSeries', err);
      }).finally(() => {
        this.$vs.loading.close();
      });
    },
    addNFT() {
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      const ran = Math.ceil(Math.random() * 100);
      this.$api.NFT_Add({
        categoryHash: this.formNFT.categoryHash,
        price: this.formNFT.price,
        metaData: this.formNFT.name,
        data: `https://unsplash.it/300/280?random=${ran}`,
      }, (res) => {
        this.$vs.loading.close();
        if (res.code === 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Add NFT Success. Please Chose It Again',
            color: 'success',
          });
          this.fetchNftByClass(this.formNFT.categoryHash);
          this.fetchNft();
        }
      });
    },
    publishNFT(formData) {
      const form = formData || this.formNFT;
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      this.$api.NFT_Offer({
        hash: form.hash,
        price: form.price,
      }, (res) => {
        this.$vs.loading.close();
        if (res.code === 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Publish Success!',
            color: 'success',
          });
          this.activePrompt = false;
          this.fetchNft();
        }
      });
    },
    handleTaxOne(item) {
      this.$api.NFT_PayTaxOne(item.tokenId, (res) => {
        if (res.code === 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Tax Done',
            color: 'success',
          });
          this.fetchNftTax();
        }
      });
    },
    handleTaxAll() {
      this.$api.NFT_PayTaxAll((res) => {
        if (res.code === 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Tax Done',
            color: 'success',
          });
          this.fetchNftTax();
        }
      });
    },
  },
  created() {
    const ran = Math.random() * 20;
    this.data_hs = new Array(20).fill(1).map((e, i) => ({
      id: i,
      name: 'ShanghaiBar',
      owner: 'Billy',
      price: 1.25,
      favor: 100,
      src: `https://unsplash.it/300/280?random=${Math.ceil(i + ran)}`,
      recycle: new Date('2021-08-01 00:00:00'),
    }));
  },
  mounted() {
    this.fetchNft();
  },
};
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
      text-align: right;
      z-index: 3000;
      font-size: 26px;
      font-weight: 900;
    }
  }

  .add-card {
    margin-top: 0;
    color: white;
    background: #11998e; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #38ef7d, #11998e); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #38ef7d, #11998e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .tax-card {
    margin-top: 0;
    color: white;
    background: #FF8008; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #FFC837, #FF8008); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #FFC837, #FF8008); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  .nft-card {
    margin-top: 0;
    color: white;
    background: #833ab4; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #fcb045, #fd1d1d, #833ab4); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #fcb045, #fd1d1d, #833ab4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

</style>
