import React, { useEffect } from 'react';
import styles from './index.less';
import copy from 'images/profile/copy.png';
import dnftLogo from 'images/home/dnftLogo.png';
import contact_t from 'images/profile/t.png';
import contact_m from 'images/profile/m.png';
import like from 'images/profile/like.png';
import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getMyProfileList } from 'reduxs/actions/profile';
import { Button } from 'ui-neumorphism'

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
                  <img src={contact_m} />
                </a>
                <a>
                  <img src={contact_t} />
                </a>
                <a>
                  <img src={contact_t} />
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
        <Button>Press</Button>
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
            <img className={styles.collectionImg} src={contact_m} />
            <div className={styles.thumbnail}>
              <img src={contact_m} />
              <img src={contact_m} />
              <img src={contact_m} />
            </div>
            <div className={styles.info}>
              <div className={styles.infoLeft}>
                <img src={contact_m} />
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
