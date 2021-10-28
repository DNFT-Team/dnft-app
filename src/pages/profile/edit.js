import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  Input,
  Upload,
  Button,
} from 'element-react';
import styles from './index.less';
import { css } from 'emotion';
import camera from 'images/profile/camera.png';
import { toast } from 'react-toastify';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ipfs_post } from 'utils/ipfs-request';
import globalConf from 'config/index';
import CropperBox from './components/cropperBox';
const ProfileEditScreen = (props) => {
  const { token, datas,  onClose, onSuccess, visible, onOpen} = props;
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  const [profileFile, setProfileFile] = useState();

  const [srcCropper, setSrcCropper] = useState('');
  const [cropperVisible, setCropperVisible] = useState(false)

  const [form, setForm] = useState({});
  useEffect(() => {
    setForm({
      avatorUrl: datas?.avatorUrl,
      nickName: datas?.nickName,
      twitterAddress: datas?.twitterAddress,
      facebookAddress: datas?.facebookAddress,
      youtubeAddress: datas?.youtubeAddress,
    })
  }, [datas])
  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styles.styleFormItemContainer}>
        <div className={`${styles.label} ${label === 'Name' && styles.name_before}`}>{label}</div>
        {item}
      </div>
    );
  };

  const beforeAvatarUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.warn('The size of the uploaded avatar image cannot exceed 2MB!', {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file); // 开始读取文件
    reader.onload = (e) => {
      setSrcCropper(e.target.result);
      setCropperVisible(true);
      onClose();
    };

    return false;
  }
  const editProfile = async () => {
    if (!form?.nickName) {
      toast.warn('nickName cannot be empty', {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false)
      return true;
    }
    if(profileFile) {

    }
    if (!profileFile && !datas?.avatorUrl) {
      toast.dark('please upload Profile Photo', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    setLoading(true)


    try {
      let ipfsHash = '';
      if(profileFile) {
        const fileData = new FormData();
        fileData.append('file', profileFile)
        const ipfsData = await ipfs_post('/v0/add', fileData);
        ipfsHash = ipfsData?.data?.['Hash']
        if (!ipfsHash) {
          toast.error('Profile Photo upload failed!');
          return
        }
        toast.success('Profile Photo upload success!');
      }

      let avatorUrl = ipfsHash ?  (globalConf.ipfsDown + ipfsHash) : datas?.avatorUrl;

      const formData = new FormData();
      formData.append('address', datas?.address)
      formData.append('avatorUrl', avatorUrl);
      formData.append('nickName', form?.nickName);
      formData.append('twitterAddress', form?.twitterAddress || '');
      formData.append('facebookAddress', form?.facebookAddress || '');
      formData.append('youtubeAddress', form?.youtubeAddress || '');

      const { data }  = await post(
        '/api/v1/users/updateUser',
        formData,
        token,
      );
      if (data?.success === true) {
        toast.success('Successfully modified', {
          position: toast.POSITION.TOP_CENTER,
        });
        onSuccess()
        setForm({})
      } else {
        toast.error(data?.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)

    }

  }
  const cropperBtn = (dataUrl, file) => {
    setCropperVisible(false);
    onOpen();
    setProfileFile(file);
    setForm({ ...form, avatorUrl: dataUrl });
  }

  return (
    <React.Fragment>
      <Dialog
        title='Edit profile'
        visible={visible}
        customClass={styleModalContainer}
        onCancel={onClose}>
        <Dialog.Body style={{paddingBottom: 0}}>
          <div className={styles.profile_phone}>*Profile Photo<span>Maximum 2MB</span></div>
          <Upload
            className={styleUploadContainer1}
            multiple={false}
            showFileList={false}
            accept={'.png,.gif,.jpeg,.jpg,.svg'}
            action=""
            beforeUpload={(file) => beforeAvatarUpload(file)}
            // httpRequest={(e) => {uploadFile(e.file)}}
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
        </Dialog.Body>
        <Dialog.Footer p="10px 32px" justifyContent="flex-start">
          <Button
            loading={loading}
            className={styleModalContainerBtn}
            onClick={editProfile}>Save</Button>
        </Dialog.Footer>
      </Dialog>
      <CropperBox
        visible={cropperVisible}
        srcCropper={srcCropper}
        onCloseModal={() => {
          onOpen();
          setCropperVisible(false);
        }}
        cropperBtn={cropperBtn}
      />
    </React.Fragment>
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
`;
const styleModalContainer = css`
  max-width: 564px;
  width: calc(100% - 40px);
  border-radius: 10px;
  // height: 80vh;
  overflow: auto;
  .el-dialog__title {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }
  .el-dialog__header {
    padding: 20px 32px 0px 32px;
  }
  .el-dialog__body {
    padding: 49px 32px 32px 32px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #1B1D21;
    font-size: 16px;
  }
  .el-dialog__footer {
    padding: 0px 32px;

  }
`
const styleModalContainerBtn = css`
  width: 100%;
  background: #0057D9;
  margin-bottom: 20px;
  font-size: 16px;
  height: 48px;
  font-family: DM Sans;
  font-weight: bold;
  border-radius: 5px;
  outline: none;
  color: #fff;
  border: 0;
  &:hover {
    color: #fff;
    background: #0057D9;
  }
`
