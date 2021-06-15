<template>
  <div class="full-width">
    <div class="mk-top title-sticky">
      <span class="title">DAO</span>
      <vs-button @click="activePrompt=true" color="primary" type="relief" size="large" style="margin-left: 1rem;">Create
      </vs-button>
    </div>
    <vs-prompt
      title="Create Vote"
      @cancel="clearPayload"
      @accept="handleSubmit"
      @close="closePrompt"
      :active.sync="activePrompt">
      <div style="padding: 1rem .6rem">
        <vs-alert class="row-item" color="rgb(231, 154, 23)" active="true">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit
        </vs-alert>
        <vs-input class="row-item" placeholder="Title" v-model="formDs.title"/>
        <vs-input class="row-item" placeholder="Detail" v-model="formDs.detail" type="textarea"/>
        <vs-input-number class="row-item" label="Target" :min="1" :max="1000" v-model="formDs.target"/>
      </div>
    </vs-prompt>

    <el-timeline style="margin-top: 2rem">
      <el-timeline-item v-for="item in ds_vote" :key="item.timestamp" :timestamp="item.timestamp"
                        placement="top">
        <vs-collapse type="margin" accordion>
          <vs-collapse-item v-for="(vote,i) in item.group" :key="i">
            <div slot="header">
              {{vote.title}}
              <vs-progress :percent="100 * vote.vol/vote.target" color="primary"></vs-progress>
            </div>
            <div style="padding: 2rem 1rem;">
              {{vote.detail}}
              <vs-button @click="handleVote" color="primary" type="relief" size="large"
                         style="float: right;">Vote
              </vs-button>
            </div>
          </vs-collapse-item>
        </vs-collapse>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
  export default {
    name: "DaoTsf",
    data() {
      return {
        activePrompt: false,
        formDs:{
          target:0,
          title:'',
          detail:''
        },
        ds_vote: [
          {
            timestamp: '2021/06/04',
            group: [
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              },
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              }
            ]
          },
          {
            timestamp: '2021/06/03',
            group: [
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              },
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              }
            ]
          },
          {
            timestamp: '2021/06/02',
            group: [
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              },
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              }
            ]
          },
          {
            timestamp: '2021/06/01',
            group: [
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              },
              {
                date: '2021/06/01',
                title: 'Vote 00001',
                target: 1000,
                vol: 800,
                detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
              }
            ]
          }
        ]
      }
    },
    methods: {
      closePrompt(){},
      clearPayload(){},
      handleSubmit(){
        this.$vs.notify({
          title: 'Create Success',
          text: 'Lorem ipsum dolor sit amet, consectetur',
          color: 'primary'
        })
      },
      handleVote() {
        this.$vs.notify({
          title: 'Vote Success',
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
  .row-item{
    margin: .4rem 0;
    width: 100%;
  }
</style>
