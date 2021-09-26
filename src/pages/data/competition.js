import React from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import styles from './index.less';

const CompetitionScreen = (props) => {
  const { dispatch, location, token, address } = props;
  let history = useHistory();
  return (
    <div className={styles.boxMain}>
      <div className={styles.boxTitle}>AI data</div>
      <div className={styles.boxDesc}>Introducing the Developer home for our protocol's developer experience. Protocols in crypto<br />
are incredibly powerful and also complicated.</div>
    </div>
  )
};
export default withRouter(CompetitionScreen);