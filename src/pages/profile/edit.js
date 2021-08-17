import React from 'react';
import {
  Alert,
  Dialog,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'element-react';
import styles from './index.less';

const ProfileEditScreen = (props) => {

  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styles.styleFormItemContainer}>
        <div className={styles.label}>{label}</div>
        {item}
      </div>
    );
  };

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles.editBox}>
          <h3>Edit profile</h3>
          <p className={styles.head}>Head portrait</p>
          {renderFormItem('Name', <Input placeholder='e. g. David' />)}
          {renderFormItem('Twitter', <Input placeholder='e. g. David' />)}
          <span className={styles.saveProfile}>Save profile</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditScreen;
