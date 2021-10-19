import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dialog,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'element-react';
import {
  Badge, Text, Button, IconButton,
  Modal, ModalOverlay,
  ModalHeader, ModalFooter,
  ModalBody, ModalContent
} from '@chakra-ui/react'
import styles from './index.less';
import { css } from 'emotion';
import camera from 'images/profile/camera.png';
import { toast } from 'react-toastify';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import {Icon} from '@iconify/react'
import { ipfs_post } from 'utils/ipfs-request';
import globalConf from 'config/index';

const ProfileEditScreen = (props) => {
  let history = useHistory();
  const {address, token, location, datas,  onClose, onSuccess} = props;
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  // const datas = location?.state?.datas
  console.log(datas,'datas')
  const [form, setForm] = useState({
    avatorUrl: datas?.avatorUrl,
    nickName: datas?.nickName,
    twitterAddress: datas?.twitterAddress,
    facebookAddress: datas?.facebookAddress,
    youtubeAddress: datas?.youtubeAddress,
  });
  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styles.styleFormItemContainer}>
        <div className={`${styles.label} ${label === 'Name' && styles.name_before}`}>{label}</div>
        {item}
      </div>
    );
  };

  const uploadFile = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);
      const data = await ipfs_post('/v0/add', fileData);
      if(data?.status === 200) {
        setForm({ ...form, avatorUrl: globalConf.ipfsDown + data?.data?.Hash })
      }
    } catch (e) {
      console.log(e, 'e');
    }
  }
  const beforeAvatarUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.warn('The size of the uploaded avatar image cannot exceed 2MB!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    return isLt2M;
  }
  const editProfile = async () => {
    setLoading(true)
    if(!form?.nickName) {
      toast.warn('nickName cannot be empty', {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false)
      return true;
    }
    const formData = new FormData();
    formData.append('address', datas?.address)
    formData.append('avatorUrl', form?.avatorUrl);
    formData.append('nickName', form?.nickName);
    formData.append('twitterAddress', form?.twitterAddress || '');
    formData.append('facebookAddress', form?.facebookAddress || '');
    formData.append('youtubeAddress', form?.youtubeAddress || '');

    try {
      const { data }  = await post(
        '/api/v1/users/updateUser',
        formData,
        token,
      );
      if(data?.success === true) {
        toast.success('Successfully modified', {
          position: toast.POSITION.TOP_CENTER,
        });
        onSuccess()
        setForm({})
      }else {
        toast.error(data?.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setLoading(false)
    }catch(e) {
      console.log(e)
      setLoading(false)

    }

  }
  return (
    <Modal closeOnOverlayClick={true} blockScrollOnMount scrollBehavior="inside" borderRadius="10px"
      isCentered isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="calc(100% - 40px)" maxW="564px" >
        <ModalHeader color="#11142d"
          p="32px" fontSize="18px"
          display="flex" justifyContent="space-between"
          alignItems="center">
          Edit profile
          <IconButton onClick={onClose} aria-label="Close Modal" colorScheme="custom" fontSize="24px" variant="ghost"
            icon={<Icon icon="mdi:close"/>}/>
        </ModalHeader>
        <ModalBody p="0 32px">
          <div className={styles.profile_phone}>*Profile Photo<span>Maximum 2MB</span></div>
          <Upload
            className={styleUploadContainer1}
            multiple={false}
            showFileList={false}
            accept={'.png,.gif,.jpeg,.jpg,.svg'}
            action=""
            beforeUpload={(file) => beforeAvatarUpload(file)}
            httpRequest={(e) => {uploadFile(e.file)}}
          >
            {<img src={imageUrl || form?.avatorUrl || camera} className={styles.avatarImg} />}
          </Upload>
          {renderFormItem(
            'Name',
            <Input
              maxLength={30}
              placeholder='Name'
              value={form?.nickName}
              onChange={(value) => {
                setForm({
                  ...form,
                  nickName: value,
                });
              }}
            />
          )}
          {renderFormItem(
            'Twitter',
            <Input
              value={form?.twitterAddress}
              placeholder='https://twitter.com/'
              onChange={(value) => {
                setForm({
                  ...form,
                  twitterAddress: value,
                });
              }}
            />
          )}
          {renderFormItem(
            'Instagram',
            <Input
              value={form?.facebookAddress}
              placeholder='https://www.instagram.com/'
              onChange={(value) => {
                setForm({
                  ...form,
                  facebookAddress: value,
                });
              }}
            />
          )}
          {renderFormItem(
            'Youtube',
            <Input
              value={form?.youtubeAddress}
              placeholder='https://www.youtube.com/'
              onChange={(value) => {
                setForm({
                  ...form,
                  youtubeAddress: value,
                });
              }}
            />
          )}
        </ModalBody>
        <ModalFooter  p="10 32px" justifyContent="flex-start">
          <Button loadingText='Save' isLoading={loading} width='100%' background='#112DF2' colorScheme="custom" p="12px 42px" fontSize="16px" width="100%" borderRadius="10px"
            onClick={editProfile}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(ProfileEditScreen));


const styleUploadContainer1 = css`
  margin-bottom: 40px;
  .el-upload-dragger {
    display: flex;
    flex-direction: column;
    color: #777e90;
    background-color: red
    height: 84px;
    width: 84px;
    border-radio: 50%;
    justify-content: center;
    border: none;
    .el-upload__text {
      margin-top: 10px;
    }
  };
  .avatar {
    background: #fbfdff
  }
  .avatar-uploader-icon {
    // background: blue
  }
`;
