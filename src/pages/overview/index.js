import { Images } from '@/constants';
import React from 'react'
import { useIntl, FormattedMessage } from 'umi';

import styles from './index.less'
const Component = props => {

    return (
        <section>
            <header className={styles.header}>
                <div>
                    <h2><FormattedMessage id="home.title" /></h2>
                    <div style={{width: '330px'}}><FormattedMessage id="home.notice" /></div>
                </div>
                <img src={Images.banner1} />
            </header>
            {/* 常见问答 */}
            <section className={styles.qa}>
                <h3><FormattedMessage id="home.qa.title" /></h3>
                <div style={{ marginBottom: 4 }}><FormattedMessage id="home.q1" /></div>
                <p style={{ marginBottom: 20 }}><FormattedMessage id="home.a1" /></p>
                <div style={{ marginBottom: 4 }}><FormattedMessage id="home.q2" /></div>
                <p style={{ marginBottom: 20 }}><FormattedMessage id="home.a2" /></p>
                <div style={{ marginBottom: 4 }}><FormattedMessage id="home.q3" /></div>
                <p style={{ marginBottom: 20 }}><FormattedMessage id="home.a3" /></p>
            </section>
        </section>
    )
}
export default Component;