import React from 'react'
import { Select } from 'antd'
import styles from './index.less';
const { Option } = Select;
import { history, useIntl, FormattedMessage } from 'umi';

const data = [
    { title: 'Face recognition data collection task', bg: 'rgb(48,49,255)' },
    { title: 'Handwriting data collection task', bg: 'rgb(107,66,201)' },
    { title: 'Data collection task without masks in public areas', bg: 'rgb(253,125,10)' },
    { title: 'Large passenger flow personnel gather data collection task', bg: 'rgb(48,49,255)' },
    { title: 'Data collection task of walking the dog without leash', bg: 'rgb(253,125,10)' },
    { title: 'Data collection of suspected lung cancer cells', bg: 'rgb(48,49,255)' },
    { title: 'Virus antibody recognition data collection task', bg: 'rgb(107,66,201)' },
    { title: 'Suspected lung cancer cell data collection task', bg: 'rgb(48,49,255)' },
    { title: 'Sperm activity data collection task', bg: 'rgb(48,49,255)' },
    { title: 'Termite data collection task', bg: 'rgb(107,66,201)' },
]
const Component = props => {
    const intl = useIntl();

    return (
        <div>
            <div className={styles.top}>
                <b><FormattedMessage id="data.title" /></b>
                <Select defaultValue={3}>
                    <Option value={1}><FormattedMessage id="monday" /></Option>
                    <Option value={2}><FormattedMessage id="tuesday" /></Option>
                    <Option value={3}><FormattedMessage id="wednesday" /></Option>
                </Select>
            </div>
            <div className={styles.tip}>
                <div className={styles.tip1}>
                    <span><FormattedMessage id="data.task" /></span>
                    <span><FormattedMessage id="data.prompt" /></span>
                </div>
                <div className={styles.tip2}>
                <FormattedMessage id="data.tip1" />
                <FormattedMessage id="data.tip2" />
                <FormattedMessage id="data.tip3" />
                <FormattedMessage id="data.tip4" />
                </div>
            </div>
            <div className={styles.project}>
                {
                    data.map((obj, index) => {
                        return (
                            <div key={index} className={styles.items}>
                                <div className={styles.header}>
                                    <span>{obj.title}</span>
                                    <span><FormattedMessage id="data.task.lave" /><i>21/100</i></span>
                                </div>
                                <div className={styles.content} style={{background: obj.bg}}>
                                    <p><FormattedMessage id="data.task.detail" /></p>
                                    <div><FormattedMessage id="data.task.start.before" /></div>
                                    <div><FormattedMessage id="data.task.read.rules" /></div>
                                </div>
                                <div className={styles.bottom}>
                                    <span className={styles.bLeft}><FormattedMessage id="data.task.reward" />： <i>314.00DNFT</i></span>
                                    <span className={styles.bRight}><FormattedMessage id="data.task.start" /></span>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
export default Component;