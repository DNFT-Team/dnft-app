import React, { useState } from 'react';
import { Dialog, Input, Upload } from 'element-react';
import { Badge, Text } from '@chakra-ui/react'
import { toast } from 'react-toastify';
import { css } from 'emotion';
import { post } from 'utils/request';

const COLL_SCHEMA = {chainType: '',  address: '',  avatorUrl: '', name: '', description: '', }

const CreateCollectionModal = (props) => {
  // console.log('CreateCollectionModal', props);
  const {
    onClose, onSuccess, //  callback
    token,  //  req-token
    isNew = false, // editStatus
    formDs = COLL_SCHEMA //  form Data
  } = props;
  const [colData, setColData] = useState({
    ...COLL_SCHEMA,
    ...formDs
  })

  const renderFormItem = (label, item) => (
    <div className={styleFormItemContainer}>
      <div className='label'>{label}</div>
      {item}
    </div>
  );
  const submitColl = async () => {
    const {address, chainType} = colData
    if (token || !address) {return}
    if (!['ETH', 'BSC', 'HECO'].includes(chainType)) {
      toast.warning('Wrong network', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    colData.name = colData.name.trim()
    if (!colData.name) {
      toast.warning('Name is required', {
        position: toast.POSITION.TOP_CENTER,
      });
      return
    }
    try {
      const url = `/api/v1/${isNew ? 'collection' : 'collection/update'}`
      const result = await post(url, colData, token);
      console.log(result, 'result')
      onSuccess(result)
    } catch (e) {
      console.log(e, 'e')
      toast.error(e, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <Dialog
      customClass={styleModalContainer}
      title={`${!isNew ? 'Edit' : 'Create'} your collection`}
      visible
      onCancel={onClose}
    >
      <Dialog.Body>
        <Upload
          className={styleUploadContainer}
          drag
          showFileList={false}
          action='//jsonplaceholder.typicode.com/posts/'
          tip={
            <div className='el-upload__tip'>
              Drag or choose your file to upload
            </div>
          }
        >
          <i className='el-icon-upload2' />
          <div className='el-upload__text'>
            PNG, GIF, WEBP. Max 1Gb.
          </div>
          {colData.avatorUrl ? <img src={colData.avatorUrl} alt="avatar"/> : ''}
        </Upload>
        <Text mb="2rem">
          Network
          <Badge
            variant="solid" borderRadius="14px"
            bg="brand.600" color="white"
            p=".2rem 1.4rem" ml={2}
            fontSize="1.2em" fontWeight="bold"
          >{colData.chainType || 'Unknown Net'}</Badge>
        </Text>
        {renderFormItem(
          'Name',
          <Input
            placeholder='e. g. David'
            onChange={(value) => {
              setColData({
                ...colData,
                name: value
              })
            }}/>
        )}
        {renderFormItem(
          'Description',
          <Input
            type='textarea'
            placeholder='e. g. David'
            autosize={{ minRows: 4, maxRows: 4 }}
            onChange={(value) => {
              setColData({
                ...colData,
                description: value
              })
            }}
          />
        )}
        <div className={styleCreateNFT} onClick={submitColl}>Submit</div>
      </Dialog.Body>
    </Dialog>
  );
};
export default CreateCollectionModal;

const styleUploadContainer = css`
  margin-bottom: 40px;
  .el-upload-dragger {
    display: flex;
    flex-direction: column;
    color: #777e90;
    background-color: #f4f5f6;
    height: 182px;
    width: 500px;
    justify-content: center;
    border-radius: 10px;
    border: none;
    .el-upload__text {
      margin-top: 10px;
    }
  }
`;

const styleCreateNFT = css`
  background-color: #0049c6;
  color: white;
  padding: 18px 42px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: fit-content;
`;

const styleModalContainer = css`
  width: 564px;
  border-radius: 10px;

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 12px;
  }
  .el-dialog__title {
    color: #11142d;
    font-size: 18px;
  }
  .el-dialog__header {
    padding: 32px;
  }
  .el-dialog__body {
    padding: 0 32px 32px 32px;
  }
`;

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .label {
    margin-bottom: 10px;
  }
`;
