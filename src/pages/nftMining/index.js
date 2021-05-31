import React from 'react';
import styles from './index.less';
import { Images } from '@/constants'

var sectionStyle = {
    width: "100%",
    height: '100vh',
    backgroundSize: '100%',
    backgroundImage: `url(${Images.igobg})`
};
const Component = props => {
    return (
        <div className={styles.bg} style={sectionStyle}>
            <div className={styles.header}>
                <h1 className={styles.title}>Earn limited edition NFTs through farming</h1>
            </div>
            <div className={styles.content}>
                <div className={styles.ming}>
                    <div className={styles.iENHkv}>
                        <div className={styles.fopPhb}>
                            <div className={styles.inEYMP}>
                                <div className={styles.kBjMiw}>
                                    <span role="img" style={{ height: '63px' }}><img src={Images.dnftLogo} height="63px" /></span>
                                    <div size="24" className={styles.eougxC}></div>
                                    <div style={{ flex: '1 1 0%' }}>
                                        <div className={styles.bGcXcU}>Your DNF Balance</div>
                                        <div className={styles.jErTay}>Locked</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.eRazuU}>
                            Pending harvest
                            <div className={styles.ivOodO}>
                                <span style={{ transform: 'scale(1)', transformOrigin: 'right bottom', transition: 'transform 0.5s ease 0s', display: 'inline-block' }}><span>0.000</span></span>
                                &nbsp;&nbsp;DNFT
                            </div>
                        </div>
                    </div>
                    <div className={styles.eougxC}></div>
                    <div className={styles.iENHkv}>
                        <div className={styles.fopPhb}>
                            <div className={styles.inEYMP}>
                                <div className={styles.kBjMiw}>
                                    <div size="24" className={styles.eougxC}></div>
                                    <div style={{ flex: '1 1 0%' }}>
                                        <div className={styles.bGcXcU}>Total NFTs Supply</div>
                                        <div className={styles.jErTay}>Locked</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.eRazuU}>
                            New rewards per block
                            <div className={styles.ivOodO}>
                                <span style={{ transform: 'scale(1)', transformOrigin: 'right bottom', transition: 'transform 0.5s ease 0s', display: 'inline-block' }}><span>1,000</span></span>
                                &nbsp;&nbsp;DNFT
                            </div>
                        </div>
                    </div>
                </div>
                <div size="48" className={styles.emyvNS}></div>
                <h3 className={styles.cTRvOr}>Stake DNFTswap LP tokens to claim your very own NFTS!</h3>
                <h3 className={styles.gQdzTA}>🏆Pro Tip: DNF-ETH SLP token pool yields TWICE more token rewards per block.</h3>
                <div className={styles.dOzkPO}>See the menu</div>
            </div>

        </div>
    )
}
export default Component;