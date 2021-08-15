import React from 'react';
import styles from './index.less';
import copy from 'images/profile/copy.png';
import dnftLogo from 'images/home/dnftLogo.png';

const ProfileScreen = (props) => (
  <div className={styles.box}>
    <div className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.title}>Collection 01</div>
        <div className={styles.addressBox}>
          <span className={styles.address}>a5as25af1af...1520</span>
          <img className={styles.copyAddress} src={copy} />
        </div>
        <div className={styles.person}>
          <div className={styles.personLeft}>
            <img  className={styles.avatar} src={dnftLogo} />
            <span className={styles.desc}>Collection 02</span>
          </div>
          <div className={styles.collection}>Edit Collection</div>
        </div>
      </div>
    </div>
  </div>
);
export default ProfileScreen;
