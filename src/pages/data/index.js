import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import styles from './index.less';
import intersect from 'images/data/Intersect.png';
import intersect1 from 'images/data/Intersect1.png';
import intersect2 from 'images/data/Intersect2.png';
const DataScreen = (props) => {
  const { dispatch, location, token, address } = props;
  let history = useHistory();
  const data = [
    {
      avatar: intersect,
      title: 'AI data',
      caption: "Introducing the Developer home for our protocol's developer experience. Protocols in crypto",
      btnText: 'Coming soon',
    },
    {
      avatar: intersect1,
      title: 'AI model',
      caption: "Introducing the Developer home for our protocol's developer experience. Protocols in crypto",
      btnText: 'Coming soon',
    },
    {
      avatar: intersect2,
      title: 'Competition',
      caption: "Introducing the Developer home for our protocol's developer experience. Protocols in crypto",
      btnText: 'Enter',
      link: true
    },
  ]
  const handleLink = (isLink) => {
    if(isLink) history.push('/data/competition')
  }
  return (
    <div className={styles.boxMain}>
      <div className={styles.boxTitle}>AI data</div>
      <div className={styles.boxDesc}>Introducing the Developer home for our protocol's developer experience. Protocols in crypto<br />
are incredibly powerful and also complicated.</div>
      <div className={styles.boxCard}>
        {
          data.map((obj,index) => (
            <div key={index} className={styles.box_card_product}>
              <img src={obj.avatar} />
              <h4>{obj.title}</h4>
              <h5>{obj.caption}</h5>
              <div onClick={() => handleLink(obj.link)} className={`${styles.box_btn} ${!obj.link ? styles.box_btn_come : null}`}>{obj.btnText}</div>
            </div>
          ))
        }
      </div>
      <p className={styles.box_footer}>We do not own your private keys and cannot access your funds without your confirmation.</p>
    </div>
  )
};
export default withRouter(DataScreen);