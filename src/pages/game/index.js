import { Images } from '@/constants';
import React from 'react'
import styles from './index.less';
import { history, useIntl, FormattedMessage } from 'umi';

const data = [
    {
        img: Images._game1,
        title: 'Rocket dice'
    },
    {
        img: Images.game2,
        title: 'Landmine'
    },
    {
        img: Images.game3,
        title: 'Keno'
    },
    {
        img: Images.game4,
        title: 'Dice'
    },
    {
        img: Images.game5,
        title: 'Princ'
    },
    {
        img: Images.game6,
        title: 'Poker'
    },
    {
        img: Images.game7,
        title: 'Landmine'
    },
    {
        img: Images.game8,
        title: 'Keno'
    },
    {
        img: Images.game9,
        title: 'Landmine'
    },
    {
        img: Images.game10,
        title: 'Keno'
    },
]
const Component = props => {

    return (
        <div>
            <div className={styles.banner} style={{
                backgroundImage: `url(${Images.game_banner1})`,
                backgroundSize: 'contain'
            }}>
                <div className={styles.t1}>
                    <div className={styles.tit}>Wagered Contest</div>
                    <div className={styles.info}>Bet More, Win More!</div>
                    <a href="#/platform/contest" className={styles.btn}>
                        <span className={styles.rocket}>
                        </span>
                             READ MORE</a>
                </div>
                <div className={styles.t2}>
                    <div>platform profit share</div>
                    <div>5%</div>
                </div>
                <div
                    className={styles.t3}
                    style={{
                        background: `url(${Images.game_banner1_right}) no-repeat 50% 50%`,
                        backgroundSize: 'auto 60%'
                    }}></div>
                {/* <img src={Images.game_banner1} /> */}
            </div>
            <div className={styles.main}>
                <div className={styles.title}><FormattedMessage id="game.title" /></div>
                <div className={styles.items}>
                    {
                        data.map((obj, i) => {
                            return (
                                <div key={i} className={styles.list}>
                                    <div className={styles.img}>
                                        <img src={obj.img} />
                                    </div>
                                    <div className={styles.gameName}>{obj.title}</div>
                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}
export default Component;