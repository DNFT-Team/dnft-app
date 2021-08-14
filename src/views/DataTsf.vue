<template>
  <div class="full-width">
    <div class="mk-top title-sticky bg-white dark:bg-gray-800">
      <span class="title">AI</span>
      <vs-button @click="openPopUpData" color="success" type="line"
                 size="large" style="margin-left: 1rem;">Data+
      </vs-button>
      <vs-button @click="openPopUpModel" color="success" type="line"
                 size="large" style="margin-left: 1rem;">Model+
      </vs-button>
      <div>
        <vs-select
          color="danger"
          label="Sort"
          class="text-black dark:text-red-600"
          v-model="query.sort"
        >
          <div :key="index" v-for="(item,index) in opts_sort">
            <vs-select-group :title="item.title" v-if="item.group">
              <vs-select-item :key="index" :value="item.value" :text="item.text"
                              v-for="(item,index) in item.group"/>
            </vs-select-group>
          </div>
        </vs-select>
      </div>
    </div>
    <vs-popup title="Create Data" :active.sync="activePromptData">
      <div style="padding: 1rem .6rem">
        <vs-select
          color="primary"
          label="Industry"
          class="full-width"
          v-model="formData.industry"
        >
          <vs-select-item v-for="(item,index) in opts_industry" :key="index" :value="item.value"
                          :text="item.text"/>
        </vs-select>
        <vs-select
          color="primary"
          label="Technology"
          class="full-width"
          v-model="formData.technology"
        >
          <vs-select-item v-for="(item,index) in opts_technology" :key="index" :value="item.value"
                          :text="item.text"/>
        </vs-select>
        <vs-select
          color="primary"
          label="Resource"
          class="full-width"
          v-model="formData.resource"
        >
          <vs-select-item v-for="(item,index) in opts_resource" :key="index" :value="item.value"
                          :text="item.text"/>
        </vs-select>
      </div>
      <div style="text-align: right;width: 100%;">
        <vs-button color="primary" type="relief" @click="submitData">Submit</vs-button>
      </div>
    </vs-popup>
    <vs-popup title="Create Model" :active.sync="activePromptModel">
      <div style="padding: 1rem .6rem">
        <vs-input label="Title" class="full-width" v-model="formModel.title" />
        <vs-input label="Framework" class="full-width" v-model="formModel.framwork"/>
        <vs-select
          color="primary"
          label="language"
          class="full-width"
          v-model="formModel.language"
        >
          <vs-select-item v-for="(item,index) in opts_language" :key="index" :value="item.value"
                          :text="item.text"/>
        </vs-select>
      </div>
      <div style="text-align: right;width: 100%;">
        <vs-button color="primary" type="relief" @click="submitModel">Submit</vs-button>
      </div>
    </vs-popup>
    <vs-tabs alignment="fixed" style="margin-top: 1rem">
      <vs-tab label="Data" @click="getList_data">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in ds_offedData" :key="item.hash">
            <vs-card actionable class="full-width">
              <div slot="header" class="top-ai">
                <strong>{{item.timestamp|timeFormat}}</strong>
                <span>
                  <vs-icon color="warning" icon="star"></vs-icon>
                  {{item.stars}}
                </span>
              </div>
              <div>
                    <span class="long-txt">
                      #Creator: {{item.creator}}
                    </span>
                <el-divider/>
                <div class="chip-row">
                  <vs-chip transparent color="primary">
                    {{item.industry}}
                  </vs-chip>
                  <vs-chip transparent color="warning">
                    {{item.resource}}
                  </vs-chip>
                  <vs-chip transparent color="success">
                    {{item.technology}}
                  </vs-chip>
                </div>
              </div>
              <div slot="footer">
                <vs-row vs-justify="flex-end">
                  <vs-button type="gradient" color="primary" icon="visibility"
                             :to="{name:'ai-info',params:{type:'data',ds:item}}"></vs-button>
                </vs-row>
              </div>
            </vs-card>
          </el-col>
        </el-row>
      </vs-tab>
      <vs-tab label="Model" @click="getList_model">
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in ds_offedModel" :key="item.hash">
            <vs-card actionable>
              <div slot="header" class="top-ai">
                <strong>{{item.timestamp|timeFormat}}</strong>
                <span>
                  <vs-icon color="warning" icon="star"></vs-icon>
                  {{item.stars}}
                </span>
              </div>
              <div>
                    <p class="long-txt">
                      #Creator: {{item.creator}}
                    </p>
                    <section>
                      #Title:
                      {{ item.title }}
                    </section>
                <el-divider/>
                <div class="chip-row">
                  <vs-chip transparent color="primary">
                    {{item.language}}
                  </vs-chip>
                  <vs-chip transparent color="warning">
                    {{item.framwork}}
                  </vs-chip>
                </div>
              </div>
              <div slot="footer">
                <vs-row vs-justify="flex-end">
                  <vs-button type="gradient" color="primary" icon="visibility"
                             :to="{name:'ai-info',params:{type:'model',ds:item}}"></vs-button>
                </vs-row>
              </div>
            </vs-card>
          </el-col>
        </el-row>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
import dnftJson from '../config/dnft.json';

export default {
  name: 'DataTsf',
  filters: {
    timeFormat(stamp) {
      return new Date(stamp * 1000).toLocaleString();
    },
  },
  data() {
    return {
      activePromptData: false,
      activePromptModel: false,
      formData: {
        industry: '',
        technology: '',
        resource: '',
      },
      formModel: {
        title: '',
        language: '',
        framwork: '',
      },
      opts_industry: [],
      opts_technology: [],
      opts_resource: [],
      opts_language: [],
      query: { sort: 'favor' },
      opts_sort: [
        {
          title: 'Favor',
          group: [{ text: 'Most Favourite', value: 'favor' }],
        },
        {
          title: 'Price',
          group: [
            { text: 'High to low', value: 'asc' },
            { text: 'Low to High', value: 'desc' },
          ],
        },
      ],
      ds_offedData: [],
      ds_offedModel: [],
      ds_neededData: [],
      ds_neededModel: [],
    };
  },
  created() {
    this.opts_industry = dnftJson.DataIndustry._enum.map((e) => ({
      text: e, value: e,
    }));
    this.opts_technology = dnftJson.DataTechnology._enum.map((e) => ({
      text: e, value: e,
    }));
    this.opts_resource = dnftJson.DataResource._enum.map((e) => ({
      text: e, value: e,
    }));
    this.opts_language = dnftJson.ModelLanguage._enum.map((e) => ({
      text: e, value: e,
    }));
    this.ds_neededData = new Array(8).fill(1).map((e, i) => ({
      name: 'Name_xxxxx',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      tags: ['Health', 'Phone Call', 'Map'],
      hash: i,
      price: 1.2,
    }));
    this.ds_neededModel = new Array(8).fill(1).map((e, i) => ({
      name: 'Name_xxxxx',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      tags: ['Health', 'Phone Call', 'Map'],
      hash: i,
      price: 1.2,
    }));
  },
  computed: {
    chainOk() {
      return this.$store.state.chainState.Api && this.$store.state.chainState.isConnected;
    },
  },
  watch: {
    chainOk(bool) {
      bool && !this.isLoad && this.getList_data();
    },
  },
  mounted() {
    this.getList_data();
  },
  methods: {
    checkWallet() {
      const { address } = this.$store.state;
      if (!address) {
        this.$vs.notify({
          position: 'top-center',
          title: 'System hint',
          text: 'Please connect wallet',
          color: 'warning',
        });
        return false;
      }
      return true;
    },
    openPopUpData() {
      const status = this.checkWallet();
      if (!status) return;
      Object.keys(this.formData).forEach((e) => { this.formData[e] = ''; });
      this.activePromptData = true;
    },
    openPopUpModel() {
      const status = this.checkWallet();
      if (!status) return;
      Object.keys(this.formModel).forEach((e) => { this.formModel[e] = ''; });
      this.activePromptModel = true;
    },
    submitData() {
      const status = this.checkWallet();
      if (!status) return;
      const form = { ...this.formData };
      const verify = Object.keys(form).reduce(
        (t, c) => (t += (form[c] ? 0 : 1)),
        0,
      );
      if (verify > 0) {
        this.$vs.notify({
          title: 'System Hint',
          text: 'Please fill the form',
          color: 'warning',
        });
      } else {
        this.$vs.loading({ color: '#11047A', type: 'radius' });
        this.$api.aiAddData(form, (res) => {
          if (res.code === 0) {
            this.$vs.notify({
              title: 'System Hint',
              text: 'Create data success',
              color: 'success',
            });
          }
          this.activePromptData = false;
          this.$vs.loading.close();
          this.getList_data();
        });
      }
    },
    submitModel() {
      const status = this.checkWallet();
      if (!status) return;
      const form = { ...this.formModel };
      const verify = Object.keys(form).reduce(
        (t, c) => (t += (form[c] ? 0 : 1)),
        0,
      );
      if (verify > 0) {
        this.$vs.notify({
          title: 'System Hint',
          text: 'Please fill the form',
          color: 'warning',
        });
      } else {
        this.$vs.loading({ color: '#11047A', type: 'radius' });
        this.$api.aiAddModel(form, (res) => {
          if (res.code === 0) {
            this.$vs.notify({
              title: 'System Hint',
              text: 'Create model success',
              color: 'success',
            });
          }
          this.activePromptModel = false;
          this.$vs.loading.close();
          this.getList_model();
        });
      }
    },
    getList_data() {
      if (!this.chainOk) return;
      this.ds_offedData = [];
      this.$vs.loading({ color: '#047a47', type: 'radius' });
      this.$api.getAiDataList().then((res) => {
        this.ds_offedData = res;
      }).finally(() => {
        this.$vs.loading.close();
      });
    },
    getList_model() {
      if (!this.chainOk) return;
      this.ds_offedModel = [];
      this.$vs.loading({ color: '#047a47', type: 'radius' });
      this.$api.getAiModelList().then((res) => {
        this.ds_offedModel = res;
      }).finally(() => {
        this.$vs.loading.close();
      });
    },
  },
};
</script>

<style scoped>
.top-ai{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}
.long-txt{
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
  display: inline-block;
}
.chip-row{
  margin-top: 1rem;
  display: flex;
  flex-flow: column nowrap;
}
</style>
