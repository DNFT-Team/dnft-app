import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  Input,
  Upload,
  Button,
} from 'element-react';
import styles from './index.less';
import { css } from 'emotion';
import upload_icon from 'images/profile/upload_icon.png'
import { toast } from 'react-toastify';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ipfs_post } from 'utils/ipfs-request';
import globalConf from 'config/index';
import CropperBox from 'components/CropperBox';
import {Btn} from 'components/Button'
import  { useTranslation } from 'react-i18next';

const ProfileEditScreen = (props) => {
  const { token, datas,  onClose, onSuccess, visible, onOpen} = props;
  const [loading, setLoading] = useState(false)
  const [profileFile, setProfileFile] = useState(null);
  const { t } = useTranslation();

  const [srcCropper, setSrcCropper] = useState('');
  const [cropperVisible, setCropperVisible] = useState(false)

  const [form, setForm] = useState({});
  useEffect(() => {
    setForm({
      avatorUrl: datas?.avatorUrl,
      nickName: datas?.nickName,
      twitterAddress: datas?.twitterAddress?.replace('https://twitter.com/','') ,
      facebookAddress: datas?.facebookAddress?.replace('https://www.instagram.com/','') ,
      youtubeAddress: datas?.youtubeAddress?.replace('https://youtube.com/','') ,
    })
  }, [datas])
  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styles.styleFormItemContainer}>
        <div className={`${styles.label} ${label === 'Name' && styles.name_before}`}>{t(`profile.${label}`)}</div>
        {item}
      </div>
    );
  };

  const beforeAvatarUpload = (file) => {
    const reader = new FileReader();
    const isLt15M = file.size / 1024 / 1024 < 15;
    if (!isLt15M) {
      toast.warn(t('cropImg.unpoaded.size.limit15'));
      return
    }
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setSrcCropper(e.target.result);
      setCropperVisible(true);
      onClose();
    };
    return false;
  }
  const editProfile = async () => {
    setLoading(true)
    if (!form?.nickName) {
      toast.warn(t('toast.nickName.not.empty'), {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false)
      return true;
    }
    if (!profileFile && !datas?.avatorUrl) {
      toast.dark(t('toast.upload.photo'), {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoading(false)
      return;
    }


    try {
      let ipfsHash = '';
      if(profileFile) {
        const fileData = new FormData();
        fileData.append('file', profileFile)
        const ipfsData = await ipfs_post('/v0/add', fileData);
        ipfsHash = ipfsData?.data?.['Hash']
        console.log('Hash,HashHash',ipfsData,ipfsData?.data,ipfsHash)
        if (!ipfsHash) {
          toast.error(t('toast.ipfs.upload.failed'));
          setLoading(false)
          return
        }
        toast.success(t('toast.ipfs.upload.success'));
      }

      let avatorUrl = ipfsHash ?  (globalConf.ipfsDown + ipfsHash) : datas?.avatorUrl;

      const formData = new FormData();
      formData.append('address', datas?.address)
      formData.append('avatorUrl', avatorUrl);
      formData.append('nickName', form?.nickName);
      formData.append('twitterAddress', form?.twitterAddress ? 'https://twitter.com/' + form?.twitterAddress : '');
      formData.append('facebookAddress', form?.facebookAddress ? 'https://www.instagram.com/' + form?.facebookAddress : '');
      formData.append('youtubeAddress', form?.youtubeAddress ? 'https://www.youtube.com/' + form?.youtubeAddress : '');

      const { data }  = await post(
        '/api/v1/users/updateUser',
        formData,
        token,
      );
      if (data?.success === true) {
        toast.success(t('toast.success.modify'), {
          position: toast.POSITION.TOP_CENTER,
        });
        onSuccess()
        setProfileFile(null)
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
        title={t('profile.setting.profile')}
        visible={visible}
        customClass={styleModalContainer}
        onCancel={onClose}>
        <Dialog.Body style={{paddingBottom: 0}}>
          <div className={styles.profile_phone}>{t('profile.photo')}<i>*</i><span>{t('profile.max.2mb')}</span></div>
          <Upload
            className={styleUploadContainer1}
            multiple={false}
            showFileList={false}
            accept={'.png,.gif,.jpeg,.jpg,.svg'}
            action=""
            beforeUpload={(file) => beforeAvatarUpload(file)}
          >
            {
              form?.avatorUrl
                ? <img src={form?.avatorUrl} className={'avatarImg'} />
                : <div className='upload_icon'>
                  <img src={upload_icon} />
                  <span>PNG, JPG</span>
                </div>
            }
          </Upload>
          {renderFormItem(
            'Name',
            <Input
              maxLength={30}
              placeholder={t('profile.Name')}
              value={form?.nickName}
              className={styleNickName}
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
              prepend="https://twitter.com/"
              value={form?.twitterAddress}
              // placeholder='please enter'
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
              prepend="https://www.instagram.com/"
              value={form?.facebookAddress}
              // placeholder='please enter'
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
              prepend="https://www.youtube.com/"
              value={form?.youtubeAddress}
              // placeholder='please enter'
              onChange={(value) => {
                setForm({
                  ...form,
                  youtubeAddress: value,
                });
              }}
            />
          )}
        </Dialog.Body>
        <Dialog.Footer style={{
          textAlign: 'center',
          marginBottom: '20px'
        }} p="10px 32px">
          <Btn
            loading={loading}
            // className={styleModalContainerBtn}
            onClick={editProfile}>{t('save')}</Btn>
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
  margin-bottom: 20px;
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
  .avatarImg {
    // background-color: #DDDDDD;
    width: 84px;
    height: 84px;
    border-radius: 50%;
  }
  .upload_icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background-color: #DDDDDD;
    img {
      width: 14px;
    }
    span {
      font-family: Helvetica;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 12px;
      color: #888888;
      margin-top: 5px;

    }
  }
`;
const styleModalContainer = css`
  max-width: 500px;
  width: calc(100% - 40px);
  border-radius: 10px;
  // height: 80vh;
  overflow: auto;
  .el-dialog__title {
    color: #11142D;
    font-family: Archivo Black;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 24px;
  }
  .el-dialog__header {
    padding: 30px;
    padding-bottom: 0px;
  }
  .el-dialog__body {
    padding: 30px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #1B1D21;
    font-weight: bold;
    font-size: 16px;
  }
  .el-input-group__append, .el-input-group__prepend {
    padding-right: 0;
    color: #1f2d3d;
  }
  .el-input__inner {
    border: 2px solid #E1E6FF;
    height: 40px;
    padding-left: 0;
    border-left: 0
  }
  .el-dialog__footer {
    padding: 0px 32px;

  }
`
const styleNickName = css`
.el-input__inner {
  border: 2px solid #E1E6FF;
  height: 40px;
  padding: 0 10px;
}
`;
// const styleModalContainerBtn = css`
//   // width: 150px;
//   height: 40px;
//   margin: 0 auto;
//   background: #0057D9;
//   border-radius: 5px;
//   margin-bottom: 20px;
//   font-size: 16px;
//   font-family: Archivo Black;
//   border-radius: 5px;
//   outline: none;
//   color: #FCFCFD;
//   border: 0;
//   &:hover {
//     color: #fff;
//     background: #0057D9;
//   }
// `
