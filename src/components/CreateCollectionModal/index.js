import React, { useState } from 'react';
import { Input, Upload } from 'element-react';
import {
  Badge, Text, Button, IconButton,
  Modal, ModalOverlay,
  ModalHeader, ModalFooter,
  ModalBody, ModalContent
} from '@chakra-ui/react'
import {Icon} from '@iconify/react'
import { toast } from 'react-toastify';
import { css } from 'emotion';
import { post } from 'utils/request';
import globalConf from 'config/index';

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

  const uploadFile = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);

      const { data = { fileUrl: '' } } = await post('/api/v1/file/uploadFile', fileData);
      setColData({
        ...colData,
        avatorUrl: data.fileUrl || '',
      });
    } catch (e) {
      console.log(e, 'e');
    }
  };

  const renderFormItem = (label, item) => (
    <div className={styleFormItemContainer}>
      <div className='label'>{label}</div>
      {item}
    </div>
  );

  const submitColl = async () => {
    const {address, chainType} = colData
    if (!token || !address) {return}
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
      const url = `/api/v1/${isNew ? 'collection/' : 'collection/update'}`
      const {data} = await post(url, colData, token);
      if (data.success) {
        toast.success(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        onSuccess(data)
      } else {
        toast.error(data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (e) {
      console.log(e, 'e')
      toast.error(e, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  return (
    <Modal closeOnOverlayClick={false} blockScrollOnMount={false}  borderRadius="10px"
      isCentered isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="564px" maxW="60vw">
        <ModalHeader color="#11142d"
          p="32px" fontSize="18px"
          display="flex" justifyContent="space-between"
          alignItems="center">
          {`${!isNew ? 'Edit' : 'Create'} your collection`}
          <IconButton onClick={onClose} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
            icon={<Icon icon="mdi:close"/>}/>
        </ModalHeader>
        <ModalBody p="0 32px">
          <Upload
            className={styleUploadContainer}
            drag
            multiple={false}
            withCredentials
            limit={1}
            action=""
            httpRequest={(e) => {uploadFile(e.file)}}
            tip={<div className='el-upload__tip'> Drag or choose your file to upload </div>}
          >
            <i className='el-icon-upload2' />
            <div className='el-upload__text'>
                PNG, GIF, WEBP. Max 1Gb.
            </div>
            {colData.avatorUrl ? <img src={globalConf.backendApi + '/data/' + colData.avatorUrl} alt="avatar"/> : ''}
          </Upload>
          <Text mb="2rem">
              Network
            <Badge
              variant="solid"
              bg="brand.400" color="white"
              p=".2rem 1.4rem" ml={4}
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

        </ModalBody>
        <ModalFooter justifyContent="flex-start">
          <Button colorScheme="custom" p="12px 42px" fontSize="16px" width="fit-content" borderRadius="10px"
            onClick={submitColl}>Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .label {
    margin-bottom: 10px;
  }
`;
