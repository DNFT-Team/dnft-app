import {
  Alert,
  Dialog,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'element-react';
import { css } from 'emotion';
import React, { useMemo, useState } from 'react';

const CreateNFT = (props) => {
  const [options, setOptions] = useState([
    {
      value: '1',
      label: '黄金糕',
    },
    {
      value: '2',
      label: '双皮奶',
    },
    {
      value: '3',
      label: '蚵仔煎',
    },
    {
      value: '4',
      label: '龙须面',
    },
    {
      value: '5',
      label: '北京烤鸭',
    },
    {
      value: 'other',
      label: 'New collection +',
    },
  ]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);

  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styleFormItemContainer}>
        <div className='label'>{label}</div>
        {item}
      </div>
    );
  };

  const renderModal = useMemo(
    () => (
      <Dialog
        customClass={styleModalContainer}
        title='Create your collection'
        visible={showCreateCollection}
        onCancel={() => {
          setShowCreateCollection(false);
        }}
      >
        <Dialog.Body>
          <Upload
            className={styleUploadContainer}
            drag
            action="//jsonplaceholder.typicode.com/posts/"
            tip={
              <div className="el-upload__tip">
                Drag or choose your file to upload
              </div>
            }
          >
            <i className="el-icon-upload2"></i>
            <div className="el-upload__text">
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
    ),
    [showCreateCollection]
  );

  return (
    <React.Fragment>
      <Alert
        className={styleAlert}
        title={
          'You have not created the collection yet.   OpenSea will include a link to this URL on this item\'s detail page'
        }
        type='warning'
      />

      <div className={styleContainer}>
        <h1>Create new NFT</h1>
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
        <h3>Item Details</h3>
        {renderFormItem('Name', <Input placeholder='e. g. David' />)}
        {renderFormItem(
          'Description',
          <Input
            type='textarea'
            placeholder='e. g. David'
            autosize={{ minRows: 4, maxRows: 4 }}
          />
        )}
        {renderFormItem(
          'Collection',
          <Select
            placeholder='please choose'
            onChange={(value) => {
              if (value === 'other') {
                setShowCreateCollection(true);
              }
            }}
          >
            {options.map((el) => {
              console.log(el, 'el');
              return (
                <Select.Option
                  key={el.value}
                  label={el.label}
                  value={el.value}
                />
              );
            })}
          </Select>
        )}
        {renderFormItem(
          'Category',
          <Select placeholder='please choose'>
            {options.map((el) => {
              console.log(el, 'el');

              return (
                <Select.Option
                  key={el.value}
                  label={el.label}
                  value={el.value}
                />
              );
            })}
          </Select>
        )}
        {renderFormItem('Supply', <InputNumber value={1} />)}
        {renderFormItem('BlockChain', <Input placeholder='Ethereum' />)}
        <div className={styleCreateNFT}>Create</div>
      </div>
      {renderModal}
    </React.Fragment>
  );
};
export default CreateNFT;

const styleContainer = css`
  display: flex;
  flex-direction: column;
  margin: 16px auto;
  h1 {
    color: #23262f;
    font-size: 38px;
    margin: 0 0 20px 0;
    padding: 0;
  }
  h3 {
    color: #23262f;
    font-size: 16px;
    padding: 0;
    margin: 0 0 40px 0;
  }
`;

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

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .label {
    margin-bottom: 10px;
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

const styleAlert = css`
  background-color: #feddbd;
  color: #e27525;
  height: 60px;
  display: flex;
  align-items: center;
  .el-icon-close {
    top: 24px;
  }
`;

const styleModalContainer = css`
  width: 564px;
  border-radius: 10px;

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 12px;
  }
  .el-dialog__title {
    color: #11142D;
    font-size: 18px;
  }
  .el-dialog__header {
    padding: 32px;
  }
  .el-dialog__body {
    padding: 0 32px 32px 32px;
  }
`;