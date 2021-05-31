import React, { useEffect, useState } from 'react'
import { connect } from 'umi';
import { Input } from 'antd';
import styles from './index.less';
import { history, useIntl, FormattedMessage } from 'umi';

const { Search } = Input;
const Component = props => {
    const intl = useIntl();
    const { dispatch, nav, product } = props;
    const [navTab, setNavTab] = useState(null);
    useEffect(() => {
        dispatch({ type: 'project/fetchType' })
        dispatch({
            type: 'project/getProduct', payload: {
                type_id: null,
            }
        })
    }, [])
    const onSearch = (value) => {
        dispatch({
            type: 'project/getProductSearch', payload: {
                keyword: value,
            }
        })
    }
    const handleNavTab = (id) => {
        setNavTab(id)
        dispatch({
            type: 'project/getProduct', payload: {
                type_id: id,
            }
        })
    }
    return (
        <div>
            <div className={styles.search}>
                <Search onSearch={onSearch} enterButton={intl.formatMessage({ id: 'trade.search' })} style={{ height: 40, fontSize: 16 }} placeholder={intl.formatMessage({ id: 'nav.placeholder' })} />
            </div>
            <div className={styles.nav}>
                <span className={navTab === null && styles.active || null} onClick={() => handleNavTab(null)}><FormattedMessage id="menu.home" /></span>
                {
                    nav && nav.data && nav.data.map(obj => {
                        return <span className={navTab === obj.id && styles.active || null} onClick={() => handleNavTab(obj.id)} key={obj.id}>{obj[intl.locale !== 'zh-CN' ? 'type_name_en' : 'type_name']}</span>
                    })
                }
            </div>
            <div className={styles.main}>
                {
                    product.map((obj, i) => {
                        return (
                            <div key={obj.id} className={styles.list}>
                                <div className={styles.title}>{obj[intl.locale !== 'zh-CN' ? 'type_name_en' : 'type_name']}</div>
                                <div className={styles.box}>
                                    {
                                        obj.project && obj.project.map((_obj, _i) => {
                                            return (
                                                <a href={_obj.link} target='_blank' key={`${obj.id}_${_i}`} className={styles.item}>
                                                    <img src={_obj.icon_value} />
                                                    <div>
                                                        <div className={styles.productName}>{_obj[intl.locale !== 'zh-CN' ? 'project_name_en' : 'project_name']}</div>
                                                        <span className={styles.hotTag}>{_obj.tag_name && _obj.tag_name[0] && _obj.tag_name[0][intl.locale !== 'zh-CN' ? 'tag_name_en' : 'tag_name']}</span>
                                                    </div>
                                                </a>
                                            )
                                        })
                                    }

                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
export default connect(({ project }) => ({
    nav: project.nav,
    product: project.product,
}))(Component);