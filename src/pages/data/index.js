import React, { useEffect, useState } from 'react';
import styles from './index.less';
import data1 from 'images/data/data1.png';
import data2 from 'images/data/data2.png';
import data3 from 'images/data/data3.png';
import data4 from 'images/data/data4.png';

import avatar from 'images/data/avatar.png';
import time from 'images/data/time.png';
import more from 'images/data/more.png';
import ongoing from 'images/data/ongoing.png';
import { useHistory } from 'react-router';
const tabs = [
  { label: 'AI data', value: 0 },
  { label: 'AI model', value: 1 },
  { label: 'Competition', value: 2 },
];
const datas = [
  {
    image: data1,
    avatar: avatar,
    updated: 'Updated 11 hours ago',
    title:
      'One more one with our recently launched Unity Dashboard Kit — Gaming',
    author: 'Ruchi Bhatia',
    file: '1 File (CSV)',
    size: 'Usability 50.1 KB',
    count: 8,
  },
  {
    image: data2,
    avatar: avatar,
    updated: 'Updated 11 hours ago',
    title:
      'One more one with our recently launched Unity Dashboard Kit — Gaming',
    author: 'Ruchi Bhatia',
    file: '1 File (CSV)',
    size: 'Usability 50.1 KB',
    count: 8,
  },
  {
    image: data3,
    avatar: avatar,
    updated: 'Updated 11 hours ago',
    title:
      'One more one with our recently launched Unity Dashboard Kit — Gaming',
    author: 'Ruchi Bhatia',
    file: '1 File (CSV)',
    size: 'Usability 50.1 KB',
    count: 8,
  },
  {
    image: data4,
    avatar: avatar,
    updated: 'Updated 11 hours ago',
    title:
      'One more one with our recently launched Unity Dashboard Kit — Gaming',
    author: 'Ruchi Bhatia',
    file: '1 File (CSV)',
    size: 'Usability 50.1 KB',
    count: 8,
  },
];
const DataScreen = (props) => {
  let history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const handleTab = (obj) => {
    setTabIndex(obj.value);
  };
  const handleDetail = (obj) => {
    history.push('data/detail');
  };
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <h2 className={styles.h2}>AI data</h2>
        <div className={styles.describe}>
          Introducing the Developer home for our protocol's developer
          experience. Protocols in crypto
          <br /> are incredibly powerful and also complicated.
        </div>
        <div className={styles.tab}>
          <div className={styles.tabNav}>
            {tabs.map((obj) => (
              <span
                key={obj.value}
                onClick={() => handleTab(obj)}
                className={`${styles.tabPane} ${
                  tabIndex === obj.value && styles.tabActive
                }`}
              >
                {obj.label}
              </span>
            ))}
          </div>
          {/* tabList */}
          {tabIndex !== 2 && (
            <div className={styles.datas}>
              {datas.map((obj, i) => (
                <div key={i} className={styles.product}>
                  <img className={styles.more} src={more} />
                  <div style={{
                    background: `center center / cover no-repeat url(${obj.image})`,
                  }} className={styles.dataImg}>
                    {/* <img className={styles.dataImage} src={obj.image} /> */}
                  </div>
                  <div className={styles.avatarBox}>
                    <div className={styles.avatarContent}>
                      <img className={styles.avatarImg} src={obj.avatar} />
                    </div>
                    <div className={styles.avatarBoxRight}>
                      <img src={time} style={{ width: 14 }} />
                      <span className={styles.updated}>{obj.updated}</span>
                    </div>
                  </div>
                  <div className={styles.dataName}>{obj.title}</div>
                  <a className={styles.dataAuthor}>{obj.author}</a>
                  <div className={styles.statistics}>
                    <div className={styles.statistLeft}>
                      <span className={styles.statistSpan}>{obj.file}</span>
                      {obj.size}
                    </div>
                    <div className={styles.dataCount}>
                      <span className={styles.reduce}>-</span>
                      <span className={styles.add}>+</span>
                      <span className={styles.countNum}>{obj.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tabIndex === 2 && (
            <div className={styles.competition}>
              {datas.map((obj, i) => (
                <div className={styles.competitionBox} key={i}>
                  <div className={styles.compeLeft}>
                    <img src={obj.image} className={styles.comImg} />
                    <div className={styles.comContent}>
                      <div className={styles.comTitle}>
                        RSNA-MICCAI Brain Tumor Radiogenomic Classification
                      </div>
                      <div className={styles.comDescribe}>
                        Predict the status of a genetic biomarker important for
                        brain cancer treatment
                      </div>
                      <div className={styles.host}>
                        Host: <span className={styles.hostMain}>Be</span>
                      </div>
                      <div className={styles.progress}>
                        <div className={styles.progressCode}>
                          Code Competition：
                          <span className={styles.p1}>56 teams</span>
                        </div>
                        <div className={styles.progressStart}>
                          <span className={styles.p2} />
                          Getting Started
                        </div>
                        <div className={styles.ongoing}>
                          <img className={styles.ongoingImg} src={ongoing} />
                          Ongoing
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.compeRight}>
                    <p className={styles.compeCount}>$100,000</p>
                    <div
                      className={styles.compeViewBtn}
                      onClick={() => handleDetail()}
                    >
                      View
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DataScreen;
