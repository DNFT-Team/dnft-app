import React, { useState } from 'react';
import { Card, Form, Button,message, Input, Upload, Select, InputNumber } from 'antd';
import styles from './index.less';
import { Images } from '@/constants';
import { history, useIntl, FormattedMessage } from 'umi';
import Nft from '@/api/nft'
const { Option } = Select;
const { TextArea } = Input
const Component = props => {
    const intl = useIntl();
    const [loading, useLoading] = useState(false)
    console.log(window.state)
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm()
    const onFinish = value => {
        console.log(value, fileList);
        useLoading(true)
        Nft.Category_Add({
            originData: 'ipfs.io/ipfs/QmRVxd8dRDa2bTD3tm4teT7XEdSHozo9na1EGswLmFtYpU', // 元数据
            totalSupply: value.totalSupply, // 总发行量
            desc: value.desc, // 说明
        }, (res) => {
            // console.log(res, 'res')
            useLoading(false)
            if(res.code === 0){
                message.success('创建成功');
                history.push('/trade');
            }
        })
    }
    const handleChange = ({ fileList }) => {
        setFileList(fileList)
    }
    return (
        <Card>
            <Form form={form} className={styles.main} onFinish={onFinish}>
                <Form.Item label={intl.formatMessage({ id: 'initial.data' })}>
                    <Upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                    >
                        <img className={styles.tianjia} src={Images.tianjia} />
                    </Upload>
                </Form.Item>
                <Form.Item style={{ width: 500 }} name='totalSupply' label={intl.formatMessage({ id: 'total.circulation' })}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item style={{ width: 500 }} name='desc' label={intl.formatMessage({ id: 'desc' })}>
                    <TextArea />
                </Form.Item>

                <div style={{ width: 500, display: 'flex', justifyContent: 'center' }}>
                    <Button loading={loading} htmlType='submit' type='primary'><FormattedMessage id="created" /></Button>
                </div>
            </Form>
        </Card>
    )
}
export default Component;