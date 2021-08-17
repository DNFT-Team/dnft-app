import { Dialog, Input, Upload } from 'element-react';
import { css } from 'emotion';
import React from 'react';

const CreateCollectionModal = (props) => {
  const { onClose } = props;

  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styleFormItemContainer}>
        <div className='label'>{label}</div>
        {item}
      </div>
    );
  };

  return (
    <Dialog
      customClass={styleModalContainer}
      title='Create your collection'
      visible
      onCancel={onClose}
    >
      <Dialog.Body>
        <Upload
          className={styleUploadContainer}
          drag
          action='//jsonplaceholder.typicode.com/posts/'
          tip={
            <div className='el-upload__tip'>
              Drag or choose your file to upload
            </div>
          }
        >
          <i className='el-icon-upload2'></i>
          <div className='el-upload__text'>
            PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
          </div>
        </Upload>
        {renderFormItem('Your Full Name', <Input placeholder='e. g. David' />)}
        {renderFormItem('BlockChain', <Input placeholder='Ethereum' />)}
        {renderFormItem(
          'Description',
          <Input
            type='textarea'
            placeholder='e. g. David'
            autosize={{ minRows: 4, maxRows: 4 }}
          />
        )}
        <div className={styleCreateNFT}>Create</div>
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
  height: 20px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: 48px;
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