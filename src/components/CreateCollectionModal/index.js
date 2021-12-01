import React, { useState } from 'react';
import { Input, Dialog } from 'element-react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { css } from 'emotion';
import { post } from 'utils/request';

const COLL_SCHEMA = {
  chainType: '',
  address: '',
  avatorUrl: '',
  name: '',
  description: '',
};

const CreateCollectionModal = (props) => {
  // console.log('CreateCollectionModal', props);
  const {
    onClose,
    onSuccess, //  callback
    token, //  req-token
    isNew = false, // editStatus
    formDs = COLL_SCHEMA, //  form Data
    isProfile
  } = props;
  const [colData, setColData] = useState({
    ...COLL_SCHEMA,
    ...formDs,
  });

  const renderFormItem = (label, item, isRequired) => (
    <div className={styleFormItemContainer}>
      <div className='label'><span style={{color: '#FF2E2E'}}></span>{label}{isRequired && <i>*</i>}</div>
      {item}
    </div>
  );

  const submitColl = async () => {
    const { address, chainType } = colData;
    if(!isProfile) {
      if (!token || !address) {
        return;
      }
      if (!['ETH', 'BSC', 'HECO'].includes(chainType)) {
        toast.warning('Wrong network', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
      colData.name = colData.name.trim();
      if (!colData.name) {
        toast.warning('Name is required', {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }
    }

    try {
      const url = `/api/v1/${isNew ? 'collection/' : 'collection/update'}`;
      const { data } = await post(url, colData, token);
      if (data.success) {
        toast.success(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        onSuccess(data);
      } else {
        toast.error(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (e) {
      console.log(e, 'e');
      toast.error(e, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <Dialog
      customClass={styleCollectionModalContainer}
      style={isProfile && {height: 'auto'}}
      title={`${!isNew ? 'Edit' : 'Create'} Collection`}
      visible
      closeOnClickModal={false}
      onCancel={onClose}
    >
      <Dialog.Body>
        {renderFormItem(
          'Collection Name',
          <Input
            placeholder='e. g. David (Maximum 20 char)'
            maxLength={20}
            value={colData.name}
            onChange={(value) => {
              setColData({
                ...colData,
                name: value,
              });
            }}
          />, true
        )}
        {renderFormItem(
          'Description',
          <Input
            type='textarea'
            placeholder='Description (Maximum 500 char)'
            maxLength={500}
            style={{
              background: '#fff'
            }}
            value={colData.description}
            autosize={{ minRows: 4, maxRows: 4 }}
            onChange={(value) => {
              setColData({
                ...colData,
                description: value,
              });
            }}
          />
        )}
        <div
          className={styleCreateCollection}
          onClick={submitColl}
        >
          Save
        </div>
      </Dialog.Body>
    </Dialog>
  );
};
export default CreateCollectionModal;

const styleCollectionModalContainer = css`
  max-width: 564px;
  width: calc(100% - 40px);
  border-radius: 10px;
  height: 80vh;
  overflow: auto;
  .el-input__inner {
    border: 2px solid #E1E6FF;
    height: 40px;
  }
  .el-textarea__inner {
    border: 2px solid #E1E6FF;
    font-family: Arial;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #000000;
    font-family: Archivo Black;

    font-size: 14px;
  }
  .el-dialog__title {
    font-family: Archivo Black;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
    color: #000000;
  }
  .el-dialog__header {
    padding: 20px 32px 52px 32px;
  }
  .el-dialog__body {
    padding: 0 32px 32px 32px;
  }
  .el-input-number {
    width: 100%;
  }
`;

const styleCreateCollection = css`
   background-color: #0057D9;
   font-family: Archivo Black;
   font-style: normal;
   font-weight: normal;
   font-size: 16px;
   line-height: 16px;
   color: #FCFCFD;
   line-height: 40px;
   width: 150px;
   margin: 0 auto;
   border-radius: 5px;
   cursor: pointer;
   text-align: center;
`

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  .label {
    margin-bottom: 10px;
    font-family: Helvetica;
    font-style: normal;
    font-weight: bold;
    font-size: 14px;
    line-height: 14px;
    color: #000000;
    i {
      font-size: 18px;
      padding-left: 4px;
      font-style: normal;
      color: #FF4242;
    }
  }
`;
