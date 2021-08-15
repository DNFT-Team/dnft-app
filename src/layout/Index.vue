<template>
  <div class="m-wrapper">
    <header class="m-header shadow-xl bg-white dark:bg-gray-700">
      <div class="m-toolbar">
        <input class="p-1 text-primary placeholder-gray-500 placeholder-opacity-65 bg-gray-100
        dark:bg-gray-800 dark:text-white"
               placeholder="Search anything" v-model="globalSearch" />
        <div class="flex-cen">
          <vs-tooltip v-if="address && network"
                      text="Grant DNFT If U're New!"
                      position="left" color="danger">
            <vs-button color="danger" type="gradient"
                       icon-pack="iconfont"
                       icon="icon-kongtou"
                       @click="grantToken" />
          </vs-tooltip>
          <div class="ml-8 capitalize truncate text-center text-blue-800 dark:text-white"
               style="width: 180px;">
            <span v-if="!network">
            Connecting Chain ...</span>
            <span v-else
                  @click="triggerRightBar"
                  style="width: 180px;">{{address || 'Connect Wallet'}}</span>
          </div>
          <el-divider v-show="address" direction="vertical" style="margin: 0 1rem"/>
          <vs-switch v-model="isDark" color="danger" vs-icon-on="dark_mode"
                     vs-icon-off="light_mode"></vs-switch>
          <el-divider direction="vertical" style="margin: 0 1rem"/>
          <vs-button color="primary" type="gradient" icon="monetization_on"
                     :to="{name:'Assets'}"></vs-button>
          <el-divider direction="vertical" style="margin: 0 1rem"/>
          <vs-button color="primary" type="gradient" icon="account_balance_wallet"
                     @click="triggerRightBar"></vs-button>
        </div>
      </div>
    </header>
    <div class="m-sidebar bg-primary dark:bg-gray-900">
      <div class="m-brand">
        <img class="full-width full-height" src="/img/brand.svg" alt="dnft">
        <p class="text-white font-serif">DNFT Protocol</p>
      </div>
      <div class="m-menus">
        <div class="m-menu-item" :class="{'active':$route.name===menu.name}"
             v-for="menu in menuList" :key="menu.name" @click="$router.push(menu)">
          <vs-icon icon-pack="iconfont" :icon="menu.meta.icon" size="24px"></vs-icon>
          <span class="m-menu-label">{{menu.meta.title}}</span>
        </div>
      </div>
      <div class="m-footage">
        <vs-button class="m-help" icon="help_center" color="#c72a75" target :href="docLink"
                   gradient-color-secondary="#5252e8" type="gradient">Help Center
        </vs-button>
        <div class="m-links">
          <vs-button
            v-for="link in links" :key="link.name"
            target :href="link.url"
            class="item"  type="flat" radius
            icon-pack="iconfont" :icon="link.icon"
            color="rgba(255,255,255,0.4)" text-color="white"
          />
        </div>
        <p>
          <span>Powered by</span>
          <vs-button href="https://www.dnft.world/" targer color="white" type="line">
            <strong>D LABS</strong>
          </vs-button>
        </p>
        <p style="margin-top: .4rem;">2021 DNFT All rights reserved</p>
      </div>
    </div>
    <vs-sidebar position-right parent="body"
                default-index="1" color="primary" spacer v-model="right">
      <div class="flex-cen" slot="header">
        <a href="https://polkadot.network/" target="_blank">
          <img src="/img/logo-polkadot.svg" alt="polkadot">
        </a>
      </div>
      <div class="flex-cen" style="flex-direction: column">
        <vs-divider>Network Link</vs-divider>
        <vs-switch :value="network" color="success"/>
        <vs-divider>Plugin Enable</vs-divider>
        <vs-switch :value="pluginEnable" color="success"/>
        <vs-divider>Choose Address</vs-divider>
        <ul style="text-align: left" class="full-width">
          <li v-for="(p,i) in pairs" :key="p.address" class="full-width adr-row">
            <vs-radio v-model="selectedAdr" :vs-value="p.address" class="no">No.{{i+1}}</vs-radio>
            <div class="text">Name: {{p.meta.name || '@Name'}}</div>
            <div class="text" :title="p.address">Address: {{p.address}}</div>
          </li>
        </ul>
        <div class="side-footer">
          <a class="net-links" :href="appUrl">
            ETH-Net
          </a>
        </div>
      </div>
    </vs-sidebar>
    <div class="m-page xd-scroll bg-white text-blue-900 dark:text-white dark:bg-gray-700">
      <main class="m-main">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.name"/>
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import { numberToHex } from '@polkadot/util';
import { createTestKeyring } from '@polkadot/keyring/testing';
import { menu } from '../router/routes';
import conf from '../config/conf';

export default {
  name: 'Index',
  data() {
    return {
      appUrl: conf.app_net_link,
      globalSearch: '',
      isDark: false,
      right: false,
      pluginEnable: false,
      selectedAdr: '',
      pairs: [],
      menuList: menu,
      docLink: 'https://dnft.gitbook.io/dnft/#home',
      links: [
        { name: 'github', url: 'https://github.com/DNFT-Team/', icon: 'icon-github' },
        { name: 'telegram', url: 'https://t.me/dnftprotocol', icon: 'icon-telegram' },
        { name: 'discord', url: 'https://discord.gg/pxEZB7ny', icon: 'icon-discord' },
        { name: 'twitter', url: 'https://twitter.com/DNFTProtocol', icon: 'icon-twitter' },
        { name: 'medium', url: 'https://medium.com/dnft-protocol', icon: 'icon-medium' },
      ],
    };
  },
  watch: {
    isDark(bool) {
      if (bool) {
        document.querySelector('html').classList.add('dark');
      } else {
        document.querySelector('html').classList.remove('dark');
      }
    },
    selectedAdr(newVal) {
      this.$store.commit('updateAddress', newVal);
      this.$notify({
        title: 'Wallet Hint',
        message: 'You Changed Address',
        position: 'top-left',
        customClass: 'chain-notify',
      });
    },
  },
  computed: {
    network() {
      return this.$store.state.chainState.isConnected;
    },
    address() {
      return this.$store.state.address;
    },
  },
  mounted() {
    this.checkWalletPlugin();
  },
  methods: {
    async grantToken() {
      const amount = 5;
      const value = numberToHex(amount * 1e3 * 10 ** 12);
      const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      const balance = await this.$api.getBalance(this.address);
      if (Number(balance.split(' ')[0]) >= 2) {
        this.$notify({
          title: 'Wallet Hint',
          message: 'Your Balance is enough',
          position: 'top-left',
          customClass: 'chain-notify',
        });
      }
      const keyring = createTestKeyring();
      const alicePair = keyring.getPair(ALICE);
      const transfer = this.$store.state.chainState.Api.tx.balances.transfer(this.address, value);
      const unsub = await transfer.signAndSend(alicePair, {}, (result) => {
        if (result.status.isInBlock) {
          this.$notify({
            title: 'Wallet Hint',
            message: 'Charge Success',
            position: 'top-left',
            customClass: 'chain-notify',
          });
          unsub();
        }
      });
    },
    triggerRightBar() {
      this.right = !this.right;
      this.right && this.checkWalletPlugin();
    },
    async checkWalletPlugin() {
      const allInjected = await web3Enable('NFT');
      if (allInjected && !this.pluginEnable) {
        this.$notify({
          title: 'Wallet Hint',
          message: 'Extension Inject Success',
          position: 'top-left',
          customClass: 'chain-notify',
        });
      }
      this.pluginEnable = !!allInjected;
      const allAccounts = await web3Accounts();
      this.pairs = allAccounts || [];
    },
  },
};
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
      padding-top: 40px;
      padding-left: 299px;
      min-height: 500px;
      height: 100vh;
      overflow: auto;

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
      display: flex;
      flex-flow: column nowrap;
      overflow: auto;

      .m-brand {
        height: 100px;
        width: 100px;
        margin: 40px 0 60px 65px;
        position: relative;
        p{
          position: absolute;
          bottom: -30px;
          left: 0;
          width: max-content;
        }
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
          margin: .2rem 0;
          font-size: 18px;
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
          font-weight: bold;
          border-color: white;
          background: #112df2;
          border-radius: 12px;
          animation: menuBoom ease-in-out .3s;
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
            transition: all ease-in-out .2s;
            font-size: 24px;
            &:hover{
              transform: scale(1.2);
              font-size: 28px;
            }
          }
        }

        strong {
          font-weight: 900;
        }
      }
    }
  }
  .side-footer{
    position: absolute;
    bottom: 20px;
    text-align: center;
    .net-links{
      display: flex;
      outline: none;
      cursor: pointer;
      width: 180px;
      height: 60px;
      font-weight: 500;
      font-size: 20px;
      align-items: center;
      justify-content: center;
      text-align: center;
      letter-spacing: 0.655422px;
      color: #fff;
      box-shadow: 0 6.59053px 4.56268px rgb(0 0 0%);
      border-radius: 8.86119px;
      background: linear-gradient(
        0.759turn
        , #112df2 5.72%, #9374ff 94.92%);
      transition: .3s ease-in-out;
      &:hover{
        opacity: .8;
      }
    }
  }

  @keyframes menuBoom {
    0%,100%{
      transform: scale(1);
    }
    50%{
      transform: scale(1.2);
    }
  }
</style>
