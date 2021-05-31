// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';
import ModelChain0 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/chain.js';
import ModelGlobal1 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/global.js';
import ModelHotRank2 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/hotRank.js';
import ModelLogin3 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/login.js';
import ModelProject4 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/project.js';
import ModelSetting5 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/setting.js';
import ModelUser6 from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/models/user.js';

let app:any = null;

export function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'chain', ...ModelChain0 });
app.model({ namespace: 'global', ...ModelGlobal1 });
app.model({ namespace: 'hotRank', ...ModelHotRank2 });
app.model({ namespace: 'login', ...ModelLogin3 });
app.model({ namespace: 'project', ...ModelProject4 });
app.model({ namespace: 'setting', ...ModelSetting5 });
app.model({ namespace: 'user', ...ModelUser6 });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    // run only in client, avoid override server _onCreate()
    if (typeof window !== 'undefined') {
      _onCreate()
    }
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
