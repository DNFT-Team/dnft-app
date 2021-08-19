import React, { useEffect } from 'react';
import {Icon} from '@iconify/react'
import styles from './index.less';
import copy from 'images/profile/copy.png';
import like from 'images/profile/like.png';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getMyProfileList } from 'reduxs/actions/profile';

const ProfileScreen = (props) => {
  const { dispatch, datas, location } = props;

  console.log(datas)
  let history = useHistory();
  useEffect(() => {
    dispatch(getMyProfileList());
  }, []);
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles.profile}>
          <div className={styles.left}>
            <img className={styles.authorImg} src={copy} />
            <div className={styles.authorInfo}>
              <div className={styles.authorName}>daljj</div>
              <div className={styles.addressBox}>
                <span className={styles.address}>a5as25af1af...1520</span>
                <img className={styles.copyAddress} src={copy} />
              </div>
              <div className={styles.contactImg}>
                <a>
                  <Icon icon="ri:telegram-line" />
                </a>
                <a>
                  <Icon icon="jam:twitter-circle" />
                </a>
                <a>
                  <Icon icon="jam:medium-circle" />
                </a>
              </div>
            </div>
          </div>
          <div className={styles.profileEdit}>
            <div
              onClick={() => history.push('/profile/edit')}
              className={styles.edit}
            >
              Edit Profile
            </div>
          </div>
        </div>
        {/* DATA */}
        <div className={styles.tabs}>
          <span>
            <i className={styles.tabsActive}>Collections</i>5
          </span>
          <span>
            <i>Owned</i>5
          </span>
          <span>
            <i>Created</i>5
          </span>
        </div>
        <div className={styles.datas}>
          <div className={styles.collection}>
            <Icon className={styles.collectionImg} icon="jam:medium-circle" />
            <div className={styles.thumbnail}>
              <Icon icon="jam:medium-circle" />
              <Icon icon="jam:medium-circle" />
              <Icon icon="jam:medium-circle" />
            </div>
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <Icon icon="jam:medium-circle" />
                <span>Collection 01</span>
              </div>
              <div className={styles.infoRight}>
                <img src={like} />
                <span>2121</span>
              </div>
            </div>
            <div className={styles.infoDesc}>
              Create, curate, and manage collections of unique NFTs to share and
              sell
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = ({ profile }) => ({
  datas: profile.datas,
});
export default withRouter(connect(mapStateToProps)(ProfileScreen));
