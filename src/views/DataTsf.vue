<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">Data</span>
      <vs-button color="primary" type="relief" size="large" style="margin-left: 1rem;">Create
      </vs-button>
    </div>
    <vs-tabs alignment="fixed" style="margin-top: 1rem">
      <vs-tab label="Offer">
        <vs-tabs position="left" color="danger">
          <vs-tab label="Data">
            <el-row :gutter="20">
              <el-col :span="6" v-for="item in ds_OffedData" :key="item.hash">
                <vs-card actionable>
                  <div slot="header">
                    <h3>
                      {{item.name}}
                    </h3>
                  </div>
                  <div>
                    <span>{{item.desc}}</span>
                    <el-divider/>
                    <div v-if="item.tags.length>0" style="margin-top: 1rem">
                      <vs-chip v-for="(it,n) in item.tags" :key="n" transparent color="primary">
                        {{it}}
                      </vs-chip>
                    </div>
                  </div>
                  <div slot="footer">
                    <vs-row vs-justify="flex-end">
                      <vs-button type="gradient" color="primary" icon="add_shopping_cart"
                                 @click="handleBought"></vs-button>
                    </vs-row>
                  </div>
                </vs-card>
              </el-col>
            </el-row>
          </vs-tab>
          <vs-tab label="Model">
            <el-row :gutter="20">
              <el-col :span="6" v-for="item in ds_OffedData" :key="item.hash">
                <vs-card actionable>
                  <div slot="header">
                    <h3>
                      {{item.name}}
                    </h3>
                  </div>
                  <div>
                    <span>{{item.desc}}</span>
                    <el-divider/>
                    <div v-if="item.tags.length>0" style="margin-top: 1rem">
                      <vs-chip v-for="(it,n) in item.tags" :key="n" transparent color="primary">
                        {{it}}
                      </vs-chip>
                    </div>
                  </div>
                  <div slot="footer">
                    <vs-row vs-justify="flex-end">
                      <vs-button type="gradient" color="primary"
                                 icon="add_shopping_cart"></vs-button>
                    </vs-row>
                  </div>
                </vs-card>
              </el-col>
            </el-row>
          </vs-tab>
        </vs-tabs>
      </vs-tab>
      <vs-tab label="Need">
        <vs-tabs position="left" color="danger">
          <vs-tab label="Data">
            <el-row :gutter="20">
              <el-col :span="6" v-for="item in ds_OffedData" :key="item.hash">
                <vs-card actionable>
                  <div slot="header">
                    <h3>
                      {{item.name}}
                    </h3>
                  </div>
                  <section>{{item.desc}}</section>
                  <el-divider/>
                  <div v-if="item.tags.length>0" style="margin-top: 1rem">
                    <vs-chip v-for="(it,n) in item.tags" :key="n" transparent color="primary">
                      {{it}}
                    </vs-chip>
                  </div>
                  <div slot="footer">
                    <vs-row vs-justify="flex-end">
                      <vs-button type="gradient" color="danger" icon="favorite"
                                 @click="handleBought"></vs-button>
                    </vs-row>
                  </div>
                </vs-card>
              </el-col>
            </el-row>
          </vs-tab>
          <vs-tab label="Model">
            <el-row :gutter="20">
              <el-col :span="6" v-for="item in ds_OffedData" :key="item.hash">
                <vs-card actionable>
                  <div slot="header">
                    <h3>
                      {{item.name}}
                    </h3>
                  </div>
                  <section>{{item.desc}}</section>
                  <el-divider/>
                  <div v-if="item.tags.length>0" style="margin-top: 1rem">
                    <vs-chip v-for="(it,n) in item.tags" :key="n" transparent color="primary">
                      {{it}}
                    </vs-chip>
                  </div>
                  <div slot="footer">
                    <vs-row vs-justify="flex-end">
                      <vs-button type="gradient" color="danger" icon="favorite"
                                 @click="handleBought"></vs-button>
                    </vs-row>
                  </div>
                </vs-card>
              </el-col>
            </el-row>
          </vs-tab>
        </vs-tabs>
      </vs-tab>
    </vs-tabs>
  </div>
</template>

<script>
  export default {
    name: "DataTsf",
    data() {
      return {
        ds_OffedData: []
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        this.ds_OffedData = new Array(8).fill(1).map((e, i) => ({
          name: 'Name_xxxxx',
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          tags: ['Health', 'Phone Call', 'Map'],
          hash: i,
          price: 1.2
        }))
      },
      handleBought() {
        this.$vs.notify({
          title: 'Bought Success',
          text: 'Lorem ipsum dolor sit amet, consectetur',
          color: 'primary'
        })
      }
    }
  }
</script>

<style scoped>
  .mk-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .4rem 1.6rem;
    background: white;
  }
</style>
