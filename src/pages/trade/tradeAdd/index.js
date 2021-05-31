import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Input, Select, message, InputNumber, Upload } from 'antd';
import styles from './index.less';
import { Images } from '@/constants';
import { history, useIntl, FormattedMessage } from 'umi';
import Nft from '@/api/nft'
// import {IPFS} from 'ipfs'
// const IPFS = require('ipfs')
const { Option } = Select;
const { TextArea } = Input
const Component = props => {
    const intl = useIntl();
    const [loading, useLoading] = useState(false)

    const [fileList, setFileList] = useState([]);
    const [type, useType] = useState([])
    const [form] = Form.useForm()
    const onFinish = value => {
        useLoading(true)
        let base64img = fileList[0] && fileList[0].thumbUrl;
        let desc = `${value.desc}|${value.name}`
        // return;
        Nft.NFT_Add(
            {
                metaData: base64img, // 元数据
                desc: desc, // 说明
                categoryHash: value.categoryHash,
                price: value.price
            },
            (res) => {
                useLoading(false)
                if (res.code === 0) {
                    //   console.log(res)
                    message.success('创建成功');
                    history.push('/trade');
                }
            }
        )
    }
    const handleChange = ({ fileList }) => {
        setFileList(fileList)
    }
    useEffect(async () => {
        let Category_IdList = await Nft.Category_IdList() || [];
        console.log(Category_IdList)
        let data = [
            { label: 'Latest', value: "0xadd260c565feb957c643d72e613e751f" },
            { label: 'Art', value: "0x6b4b82ae4520494dcbd8ce990be85f1d" },
            { label: 'Domain', value: "0xfbf7e23b169c8f32007a9cdb991421c6" },
            { label: 'Virtual reality', value: "0x6552923aa87abc752f5000ed1434e45a" },
            { label: 'Trading card', value: "0x45db3bbaeb72ddc48474de1821564597" },
            { label: 'Collection', value: "0xc4b7fbed9d0b9a40fbced1bcc8c19072" },
            { label: 'Sports', value: "0x79613d62bc6c5536e75c73876fca4e74" },
            { label: 'Game', value: "0x014aabbf6b2820589cbdbc3aa4ddc983" },

        ]
        useType(data);
        // console.log(IPFS)
    }, []);

    return (
        <Card>
            <Form form={form} className={styles.main} onFinish={onFinish}>
                <Form.Item label={intl.formatMessage({ id: 'initial.data' })}>
                    <Upload
                        // action="/hack"
                        // action="https://jsonplaceholder.typicode.com/posts/"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                    >
                        <img className={styles.tianjia} src={Images.tianjia} />
                    </Upload>
                </Form.Item>
                <Form.Item style={{ width: 500 }} name='name' label={intl.formatMessage({ id: 'name' })}>
                    <Input autoComplete='off' placeholder={intl.formatMessage({ id: 'input.placeholder' })} />
                </Form.Item>
                <Form.Item style={{ width: 500 }} name='categoryHash' label={intl.formatMessage({ id: 'hash.type' })}>
                    <Select placeholder={intl.formatMessage({ id: 'input.select' })}>
                        {
                            type.map((obj, i) => {
                                return <Option value={obj.value} key={obj.value}>{obj.label}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item style={{ width: 500 }} name='desc' label={intl.formatMessage({ id: 'intro' })}>
                    <TextArea />
                </Form.Item>
                <div style={{ display: 'flex' }}>
                    <Form.Item style={{ width: 500 }} name='price' label={intl.formatMessage({ id: 'price' })}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <span style={{ marginTop: 5, marginLeft: 17 }}>t DNF</span>
                </div>
                <div style={{ width: 500, display: 'flex', justifyContent: 'center' }}>
                    <Button loading={loading} htmlType='submit' type='primary'><FormattedMessage id="created" /></Button>
                </div>
            </Form>
        </Card>
    )
}
export default Component;
