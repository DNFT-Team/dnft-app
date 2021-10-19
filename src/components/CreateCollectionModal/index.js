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
  } = props;
  const [colData, setColData] = useState({
    ...COLL_SCHEMA,
    ...formDs,
  });

  const renderFormItem = (label, item, isRequired) => (
    <div className={styleFormItemContainer}>
      <div className='label'><span style={{color: '#FF2E2E'}}>{isRequired && '*'}</span>{label}</div>
      {item}
    </div>
  );

  const submitColl = async () => {
    const { address, chainType } = colData;
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
          Submit
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
  .el-textarea__inner {
    font-family: Arial;
    background: #F4F5F6;
    border: none;
  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 12px;
  }
  .el-dialog__title {
    color: #11142d;
    font-size: 18px;
    font-weight: 500;
    font-family: Poppins;
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
   background-color: rgba(17, 45, 242, 1);
   color: white;
   padding: 12px;
   font-size: 16px;
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
    font-family: Inter;
  }
`;
