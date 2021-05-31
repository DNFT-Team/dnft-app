import React from 'react'
import { Select } from 'antd'
import styles from './index.less';
import { Images } from '@/constants'
import { history, useIntl, FormattedMessage } from 'umi';

const { Option } = Select;
const data = [
    {
        img: Images[9],
        title: 'Hashmasks #10609',
        notice: 'Hashmasks',
        time: '31 minutes left',
        price: '0.21',
        id: 1,
    },
    {
        img: Images[10],
        title: 'Melania Trump',
        notice: 'Hashmasks',
        time: 'an hour left',
        price: '32',
        id: 2,
    },
    {
        img: Images[11],
        title: 'mask_0023.gas',
        notice: 'gas masks',
        time: '12 hours left',
        price: '981',
        id: 3,
    },
    {
        img: Images[12],
        title: 'DeCEX Genesis',
        notice: 'an abstracted icon',
        time: '21 hours left',
        price: '98',
        id: 4,
    },
    {
        img: Images[13],
        title: 'Zemm',
        notice: 'cryptocurrencies',
        time: '18 hours left',
        price: '28',
        id: 5,
    },
    {
        img: Images[14],
        title: 'Influencers Collection',
        notice: 'crypto industry',
        time: '18 hours left',
        price: '228',
        id: 6,
    },
    {
        img: Images[15],
        title: 'Athletes Collection',
        notice: 'competitive sports',
        time: '18 hours left',
        price: '98',
        id: 7,
    },
    {
        img: Images[16],
        title: 'Diao Chan',
        notice: 'Oriental Collection',
        time: '18 hours left',
        price: '73',
        id: 8,
    },
]
const Component = props => {
    const intl = useIntl();

    return (
        <div className={styles.content}>
            <div className={styles.top}>
                <b><FormattedMessage id="art.title" /></b>
                <Select defaultValue={3}>
                <Option value={1}><FormattedMessage id="monday" /></Option>
                    <Option value={2}><FormattedMessage id="tuesday" /></Option>
                    <Option value={3}><FormattedMessage id="wednesday" /></Option>
                </Select>
            </div>
            <div className={styles.main}>

                {
                    data.map((obj) => {
                        return (
                            <div key={obj.id} className={styles.items}>
                                <div className={styles.img}>
                                    <img src={obj.img} />
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.title1}>
                                        <span>{obj.title}</span>
                                        <span>Top Bid</span>
                                    </div>
                                    <div className={styles.title2}>
                                        <span>{obj.notice}</span>
                                        <span>{obj.price}</span>
                                    </div>
                                    <div className={styles.bottom}>
                                        {obj.time}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Component;