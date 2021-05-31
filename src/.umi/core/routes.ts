// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/ivory/WebstormProjects/dnft-substrate-front-x/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/PageLoading/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BlankLayout' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/layouts/BlankLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__SecurityLayout' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/layouts/SecurityLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/layouts/BasicLayout'), loading: LoadingComponent}),
            "routes": [
              {
                "path": "/",
                "redirect": "/overview",
                "exact": true
              },
              {
                "path": "/overview",
                "name": "overview",
                "img": "home",
                "img1": "home1",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__overview' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/overview'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "assets",
                "img": "assets",
                "img1": "assets1",
                "path": "/assets",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__assets' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/assets'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "trade",
                "img": "trade",
                "img1": "trade1",
                "path": "/trade",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__trade' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/trade'), loading: LoadingComponent}),
                "routes": [
                  {
                    "path": "/trade",
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__trade__tradeList' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/trade/tradeList'), loading: LoadingComponent}),
                    "exact": true
                  },
                  {
                    "path": "/trade/detail",
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__trade__detail' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/trade/detail'), loading: LoadingComponent}),
                    "exact": true
                  },
                  {
                    "path": "/trade/createnft",
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__trade__tradeAdd' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/trade/tradeAdd'), loading: LoadingComponent}),
                    "exact": true
                  },
                  {
                    "path": "/trade/createnftcategory",
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__trade__catagory' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/trade/catagory'), loading: LoadingComponent}),
                    "exact": true
                  }
                ]
              },
              {
                "name": "nftMining",
                "img": "nftMining",
                "img1": "nftMining1",
                "path": "/nftMining",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__nftMining' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/nftMining'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "nftNav",
                "img": "nftNav",
                "img1": "nftNav1",
                "path": "/nftNav",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__nftNav' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/nftNav'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "leaderboard",
                "img": "leaderboard",
                "img1": "leaderboard1",
                "path": "/leaderboard",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__leaderboard' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/leaderboard'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "igo",
                "img": "igo",
                "img1": "igo1",
                "path": "/igo",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__igo' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/igo'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "game",
                "img": "game",
                "img1": "game1",
                "path": "/game",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__game' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/game'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "art",
                "img": "art",
                "img1": "art1",
                "path": "/art",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__art' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/art'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "data",
                "img": "data",
                "img1": "data1",
                "path": "/data",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__data' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/data'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/404'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/404'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/ivory/WebstormProjects/dnft-substrate-front-x/src/pages/404'), loading: LoadingComponent}),
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
