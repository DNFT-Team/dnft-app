<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">DAO</span>
      <vs-button @click="openPop" color="primary" type="relief" size="large"
                 style="margin-left: 1rem;">Create
      </vs-button>
    </div>
    <vs-popup title="Create Dao" :active.sync="activePrompt">
      <div style="padding: 1rem .6rem">
        <vs-input class="row-item" v-model="formDs.ddl" type="date"/>
        <vs-textarea class="row-item" placeholder="Content" v-model="formDs.content"/>
        <vs-input-number class="row-item" label="Number" :min="0" :max="1000"
                         v-model="formDs.number"/>
        <vs-input-number class="row-item" label="Money" :min="0" :max="1000000000"
                         v-model="formDs.money"/>
        <vs-input-number class="row-item" label="Min Target" :min="1" :max="1000"
                         v-model="formDs.min_to_succeed"/>
      </div>
      <div style="text-align: right;width: 100%;">
        <vs-button @click="handleSubmit" color="primary" type="relief">Submit</vs-button>
      </div>
    </vs-popup>
    <div style="margin-top: 2rem">
      <el-timeline v-if="ds_vote.length>0">
        <el-timeline-item v-for="vote in ds_vote" :key="vote.proposalId" :timestamp="vote.ddl"
                          placement="top">
          <vs-collapse type="margin" accordion>
            <vs-collapse-item>
              <div slot="header">
                <span class="title">Name.# {{vote.number}}</span>
                <div>
                  <span>Process</span>
                  <vs-progress :percent="vote.ratioProcess" color="primary"></vs-progress>
                  <template v-if="vote.vote_yes||vote.vote_no">
                    <span>Agree</span>
                    <vs-progress :percent="vote.ratioYes" color="success">{{vote.vote_yes}}</vs-progress>
                    <span>Disagree</span>
                    <vs-progress :percent="vote.ratioNo" color="danger">{{vote.vote_no}}</vs-progress>
                  </template>
                </div>
              </div>
              <div style="padding: 2rem 1rem;">
                <section>
                  <p>#Money <span>{{vote.money}}</span></p>
                   <span style="color: #11047A;font-weight: bold">#Content: </span>
                  {{vote.content}}
                </section>
                <vs-button @click="handleVote(vote,true)" color="success" type="relief"
                           style="float: right;">Agree
                </vs-button>
                <vs-button @click="handleVote(vote,false)" color="danger" type="relief"
                           style="float: right;">Disagree
                </vs-button>
              </div>
            </vs-collapse-item>
          </vs-collapse>
        </el-timeline-item>
      </el-timeline>
      <Empty v-else/>
    </div>
  </div>
</template>

<script>
import Empty from '../components/Empty';

export default {
  name: 'DaoTsf',
  components: { Empty },
  data() {
    return {
      isLoad: false,
      activePrompt: false,
      formDs: {
        min_to_succeed: 1,
        number: 0,
        money: 0,
        ddl: '',
        content: '',
      },
      ds_vote: [],
    };
  },
  computed: {
    chainOk() {
      return this.$store.state.chainState.Api && this.$store.state.chainState.isConnected;
    },
  },
  watch: {
    chainOk(bool) {
      bool && !this.isLoad && this.fetchDaoList();
    },
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
    openPop() {
      this.formDs = {
        min_to_succeed: 1,
        number: 0,
        money: 0,
        ddl: '',
        content: '',
      };
      this.activePrompt = true;
    },
    fetchDaoList() {
      if (!this.chainOk) return;
      this.$vs.loading({ color: '#11047A', type: 'radius' });
      this.$api.DAO_List().then((res) => {
        this.ds_vote = (res || []);
        this.isLoad = true;
      }).catch(() => {
        this.ds_vote = [];
      }).finally(() => {
        this.$vs.loading.close();
      });
    },
    handleSubmit() {
      const status = this.checkWallet();
      status && this.$api.DAO_Add(this.formDs, (res) => {
        this.activePrompt = false;
        if (res.code === 0) {
          this.$vs.notify({
            position: 'top-right',
            title: 'System Hint',
            text: 'Add Dao Success.',
            color: 'success',
          });
          this.fetchDaoList();
        }
      });
    },
    handleVote(vote, flag) {
      if (vote.proposalId) {
        const status = this.checkWallet();
        if (status) {
          this.$api.DAO_Vote_Check(vote.proposalId, this.$store.state.address).then((voteState) => {
            if (voteState) {
              this.$api.DAO_Vote(vote.proposalId, flag, (res) => {
                if (res.code === 0) {
                  this.$vs.notify({
                    position: 'top-right',
                    title: 'System Hint',
                    text: 'Vote Success.',
                    color: 'success',
                  });
                  this.fetchDaoList();
                }
              });
            } else {
              this.$vs.notify({
                position: 'top-right',
                title: 'System Hint',
                text: 'You have already voted .',
                color: 'warning',
              });
            }
          });
        }
      }
    },
  },
  mounted() {
    this.fetchDaoList();
  },
};
</script>

<style scoped>
  .row-item {
    margin: .4rem 0;
    width: 100%;
  }
</style>
