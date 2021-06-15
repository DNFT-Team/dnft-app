<template>
  <div class="m-wrapper">
    <header class="m-header">
      <div class="m-toolbar">
        <vs-input icon="search" placeholder="Search" v-model="globalSearch"/>
        <div class="flex-cen">
          <vs-button color="primary" type="gradient" icon="account_balance_wallet"
                     :to="{name:'Assets'}"></vs-button>
          <el-divider direction="vertical" style="margin: 0 1rem"/>
          <vs-button color="primary" type="gradient" icon="monetization_on"
                     @click="triggerRightBar"></vs-button>
        </div>
      </div>
    </header>
    <div class="m-sidebar">
      <div class="m-brand">
        <img class="m-logo full-width full-height" src="/img/brand.svg" alt="dnft">
        <img class="m-festival full-width full-height" src="/img/festival.svg" alt="festival">
      </div>
      <div class="m-menus">
        <div class="m-menu-item" :class="{'active':$route.name===menu.name}"
             v-for="menu in menuList" :key="menu.name" @click="$router.push(menu)">
          <vs-icon icon="mood" size="24px"></vs-icon>
          <span class="m-menu-label">{{menu.meta.title}}</span>
        </div>
      </div>
      <div class="m-footage">
        <vs-button class="m-help" icon="help_center" color="#c72a75"
                   gradient-color-secondary="#5252e8" type="gradient">Help Center
        </vs-button>
        <div class="m-links">
          <vs-button class="item" radius color="grey" text-color="primary" icon="share"
                     type="flat"></vs-button>
          <vs-button class="item" radius color="grey" text-color="primary" icon="ios_share"
                     type="flat"></vs-button>
          <vs-button class="item" radius color="grey" text-color="primary" icon="screen_share"
                     type="flat"></vs-button>
          <vs-button class="item" radius color="grey" text-color="primary" icon="link"
                     type="flat"></vs-button>
          <vs-button class="item" radius color="grey" text-color="primary" icon="link"
                     type="flat"></vs-button>
        </div>
        <p>Powered by <strong>DNFT Protocol</strong></p>
        <p>2021 DNFT All rights reserved</p>
      </div>
    </div>
    <vs-sidebar position-right parent="body" default-index="1" color="primary" spacer
                v-model="right">
      <div class="flex-cen" slot="header">
        <a href="https://polkadot.network/" target="_blank">
          <img src="/img/logo-polkadot.svg" alt="polkadot">
        </a>
      </div>
      <div class="flex-cen" style="flex-direction: column">
        <vs-divider>Plugin Enable</vs-divider>
        <vs-switch :value="pluginEnable" color="success"/>
        <vs-divider>Choose Address</vs-divider>
        <ul style="text-align: left" class="full-width">
          <li v-for="(p,i) in pairs" :key="p.address" class="full-width adr-row">
            <vs-radio v-model="selectedAdr" :vs-value="p.address" class="no">No.{{i+1}}</vs-radio>
            <div class="text">{{p.meta.name || 'Name'}}</div>
            <div class="text">{{p.address}}</div>
          </li>
        </ul>
      </div>
    </vs-sidebar>
    <div class="m-config">
      <vs-button class="m-translate" icon="translate" color="danger" type="flat"></vs-button>
      <vs-switch v-model="isDark" color="danger" vs-icon-on="dark_mode"
                 vs-icon-off="light_mode"></vs-switch>
    </div>
    <div class="m-page">
      <main class="m-main">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.name"/>
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
  import {menu} from '../router/routes'
  import {web3Enable, web3Accounts} from '@polkadot/extension-dapp'

  export default {
    name: "Index",
    data() {
      return {
        globalSearch: '',
        isDark: false,
        right: false,
        pluginEnable: false,
        selectedAdr: '',
        pairs: [],
        menuList: menu
      }
    },
    watch:{
      selectedAdr(){
        this.$vs.notify({
          position:'top-center',
          title: 'Wallet Hint',
          text: 'You Changed Address',
          color: '#e6037a'
        })
      }
    },
    mounted() {
      this.checkWalletPlugin()
    },
    methods: {
      triggerRightBar(){
        this.right = !this.right
        this.right && this.checkWalletPlugin()
      },
      async checkWalletPlugin() {
        const allInjected = await web3Enable('NFT')
        if(allInjected && !this.pluginEnable){
          this.$vs.notify({
            position:'top-center',
            title: 'Wallet Hint',
            text: 'Extension Inject Success',
            color: '#e6037a'
          })
        }
        this.pluginEnable = !!allInjected
        const allAccounts = await web3Accounts()
        console.log(allAccounts);
        this.pairs = allAccounts
      }
    }
  }
</script>

<style scoped lang="less">
  .adr-row {
    padding: .4rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .no {
      font-size: 18px;
      font-weight: 900;
      color: #11047a;
    }

    .text {
      color: #594ebc;
      white-space: nowrap; /* 规定文本是否折行 */
      overflow: hidden; /* 规定超出内容宽度的元素隐藏 */
      text-overflow: ellipsis;
      width: 80%;
    }
  }

  .m-wrapper {
    position: relative;
    min-height: 500px;

    .m-header {
      position: fixed;
      top: 0;
      right: 0;
      left: 299px;
      background: white;
      padding: 2px 2rem;
      z-index: 1000;

      .m-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 56px;
      }
    }

    .m-page {
      background: white;
      padding-top: 40px;
      padding-left: 299px;
      min-height: 500px;
      height: 100vh;
      overflow: scroll;

      .m-main {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 2rem 1.2rem;
        width: 100%;
        min-height: 400px;
      }
    }

    .m-sidebar {
      width: 299px;
      position: absolute;
      top: 0;
      bottom: 0;
      z-index: 1000;
      background: #1B2559;
      display: flex;
      flex-flow: column nowrap;
      overflow: auto;

      .m-brand {
        height: 100px;
        width: 100px;
        margin: 70px 0 60px 65px;
        position: relative;

        .m-festival {
          position: absolute;
          top: 0;
          left: -10%;
          right: 0;
        }
      }

      .m-menus {
        flex-grow: 1;
        width: 80%;
        margin: 0 auto;

        .m-menu-item {
          cursor: pointer;
          padding: .8rem 1rem;
          font-size: 24px;
          line-height: 29px;
          letter-spacing: 0.02em;
          color: #C0BEFF;
          text-align: left;
          border-left: 3px solid transparent;
          transition: all ease-in-out 260ms;

          &:hover {
            border-color: #9374FF;
            opacity: .8;
          }

          .m-menu-label {
            text-transform: uppercase;
          }

          i {
            margin-right: 28px;
          }
        }

        .active {
          color: white;
          border-color: red;
        }
      }

      .m-footage {
        text-align: center;
        font-size: 16px;
        color: #C0BEFF;
        text-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
        width: 100%;
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .m-help {
          width: max-content;
          margin-bottom: 1rem;
        }

        .m-links {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          margin: .8rem 0;

          .item {
            margin: 0 .4rem;
          }
        }

        strong {
          font-weight: 900;
        }
      }
    }

    .m-config {
      position: fixed;
      bottom: 0;
      left: 299px;
      padding: .4rem 1rem .4rem 0;
      z-index: 999;
      border: 0;
      background: #1B2559;
      border-radius: 0 20px 0 0;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: row nowrap;

      &::after {
        content: '';
        background: transparent;
        width: 20px;
        height: 20px;
        position: absolute;
        top: -20px;
        left: 0;
        border-radius: 0 0 0 20px;
        box-shadow: -5px 5px 0 5px #1b2559;
        z-index: 800;
      }

      .m-translate {
        z-index: 999;
        margin-right: .4rem;
      }
    }
  }
</style>
