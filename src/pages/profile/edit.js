import React from 'react';
import styles from './index.less';

const ProfileEditScreen = (props) => (
  <div className={styles.box}>
    <div className={styles.container}>
      <div className={styles.editBox}>
        <h3>Edit profile</h3>
        <p className={styles.head}>Head portrait</p>
      </div>
    </div>
  </div>
);
export default ProfileEditScreen;
