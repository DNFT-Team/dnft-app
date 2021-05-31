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
            <div className={styles.title}>
                IGO: Initial Gaming Offerings<br />Buy new tokens with a start of playing games.
            </div>
            <div className={styles.content}>
                <div className={styles.qlVRw}>
                    <div className={styles.iYwMjt}>
                        <div className={styles.cuOtHq}>
                            <span role="img" style={{ height: '80px' }}><img src={Images.dnftLogo} height="80px" /></span>
                        </div>
                        <div className={styles.cTjcEC}>
                            <span role="img" style={{ height: '80px' }}><img src={Images.eth} height="80px" /></span>
                        </div>
                        <h1 className={styles.mBaJS}>First</h1>
                    </div>
                    <div className={styles.iaXrNy}>
                        <h3 className={styles.bHPUNb}>【DNF】DNFT Community</h3>
                        <div className={styles.ifvsRy}>To thank users for their continued support, the DNFT community will sell $1 million worth of Piggy on startup.</div>
                        <div className={styles.ifvsRy}>Raised：9,999ETH</div>
                        <div className={styles.ifvsRy}>Goal：2,500ETH(Value 2500 ETH)</div>
                        <div className={styles.klWRDC}><div className={styles.ggFBLM} style={{ width: '95%' }}></div></div>
                        <div className={styles.ifvsRy}>Start Time 2020-09-25 08:00:00 UTC-4</div>
                        <div className={styles.ifvsRy}>The goal amount is 2,500 ETH. Actual raised 9,999ETH，Actual raised ETHs are more than goal ETHs. Startup Success!</div>
                    </div>
                    <div className={styles.ZHVNp}>Hot</div>
                </div>
            </div>
        </div>
    )
}
export default Component;