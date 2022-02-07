import { Translation } from 'react-i18next';
export default {
    bridge:{
        // title:'Tutorial',
        title: <Translation>{t=>t('Tutorial')}</Translation>,
        book:'https://dnft.gitbook.io/dnft/user-manual/bridge-brief-description',
        youtube:'https://www.youtube.com/watch?v=fg4fg3vfnCU',
    },
    mining:{
        // title:'DNFT Mining User Manual',
        title: <Translation>{t=>t('user.manual')}</Translation>,
        book:'https://dnft.gitbook.io/dnft/user-manual/staking-dnf-to-earn-dnf',
        youtube:'https://www.youtube.com/watch?v=32hYrdhpSfo'
    },
    nftMagic:{
        title: <Translation>{t=>t('Tutorial')}</Translation>,
        book:'https://dnft.gitbook.io/dnft/user-manual/create-sell-buy-nft',
        youtube:'https://www.youtube.com/watch?v=uGwQNCxuheo'
    }
}
export const  contactData =[
    {
        name: 'github',
        url: 'https://github.com/DNFT-Team/',
        icon: 'mdi:github',
    },
    {
        name: 'telegram',
        url: 'https://t.me/dnftprotocol',
        icon: 'mdi:telegram',
    },
    // {
    //   name: 'discord',
    //   url: 'https://discord.gg/pxEZB7ny',
    //   icon: 'fa-brands:discord',
    // },
    {
        name: 'twitter',
        url: 'https://twitter.com/DNFTProtocol',
        icon: 'mdi:twitter',
    },
    {
        name: 'medium',
        url: 'https://medium.com/dnft-protocol',
        icon: 'mdi:medium',
    },
]