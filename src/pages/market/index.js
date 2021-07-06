import React from 'react';
import Header from './component/header';
import styles from './index.less'
import m1 from 'images/market/m1.png';
import m2 from 'images/market/m2.png';
import m3 from 'images/market/m3.png';
import m4 from 'images/market/m4.png';
import m5 from 'images/market/m5.png';
import m6 from 'images/market/m1.png';
import m7 from 'images/market/m7.png';
import m8 from 'images/market/m8.png';
import m9 from 'images/market/m9.png';
import m10 from 'images/market/m10.png';
import loading from 'images/market/loading.png'
import { withRouter, Link, useHistory } from 'react-router-dom';

const AssetsScreen = props => {
    let history = useHistory();

    const data = [
        {
            src: m1,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m2,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m3,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m4,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m5,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m6,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m7,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m8,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m9,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
        {
            src: m10,
            title: "Green-b",
            star: '123，000',
            custom: 'Micheal Yang',
            price: '1.8ETH'
        },
    ]
    const handleToDetail = (obj) => {
        history.push('market/detail')
    }
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.ArtContainer}>
                <div className={styles.content1}>

                {
                    data.map((obj, index) => {
                        return (
                            <div onClick={()=>handleToDetail(obj)} className={styles.card} key={index}>
                                <div style={{
                                    background: `center / cover no-repeat url(${obj.src})`,
                                    height: 284,
                                    marginBottom: 7,
                                }} />
                                <div className={styles.content}>
                                    <span className={styles.title}>{obj.title}</span>
                                    <span className={styles.starContainer}>
                                        <i className="el-icon-star-off"></i>
                                        <span className={styles.starAccount}>{obj.star}</span>
                                    </span>
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.name}>{obj.custom}</span>
                                    <span className={styles.price}>{obj.price}</span>
                                </div>
                            </div>
                        )
                    })
                }
                </div>

                <div className={styles.loading}>
                    loading
                <img className={styles.loadingImg} src={loading}/>
            </div>
            </div>

        </div>
    )
}
export default AssetsScreen;
