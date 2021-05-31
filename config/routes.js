export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      // {
      //   path: '/user',
      //   component: '../layouts/UserLayout',
      //   routes: [
      //     {
      //       name: 'login',
      //       path: '/user/login',
      //       component: './User/login',
      //     },
      //   ],
      // },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            // authority: ['admin'],
            routes: [
              {
                path: '/',
                redirect: '/overview',
              },
              {
                path: '/overview',
                name: 'overview',
                img: 'home',
                img1: 'home1',
                // icon: <img src={'../src/assets/home.png'} />,
                component: './overview',
              },
              {
                name: 'assets',
                img: 'assets',
                img1: 'assets1',
                path: '/assets',
                component: './assets',
              },
              {
                name: 'trade',
                img: 'trade',
                img1: 'trade1',
                path: '/trade',
                component: './trade',
                routes: [
                  {
                    path: '/trade',
                    component: './trade/tradeList'
                  },
                  {
                    path: '/trade/detail',
                    component: './trade/detail'
                  },
                  {
                    path: '/trade/createnft',
                    component: './trade/tradeAdd'
                  },
                  {
                    path: '/trade/createnftcategory',
                    component: './trade/catagory'
                  },
                ]
              },
              {
                name: 'nftMining',
                img: 'nftMining',
                img1: 'nftMining1',
                path: '/nftMining',
                component: './nftMining',
              },
              // {
              //   name: 'nftNav',
              //   img: 'nftNav',
              //   img1: 'nftNav1',
              //   path: '/nftNav',
              //   component: './nftNav',
              // },
              // {
              //   name: 'leaderboard',
              //   img: 'leaderboard',
              //   img1: 'leaderboard1',
              //   path: '/leaderboard',
              //   component: './leaderboard',
              // },
              {
                name: 'igo',
                img: 'igo',
                img1: 'igo1',
                path: '/igo',
                component: './igo',
              },
              {
                name: 'game',
                img: 'game',
                img1: 'game1',
                path: '/game',
                component: './game',
              },
              {
                name: 'art',
                img: 'art',
                img1: 'art1',
                path: '/art',
                component: './art',
              },
              {
                name: 'data',
                img: 'data',
                img1: 'data1',
                path: '/data',
                component: './data',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
