import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dialog,
  Input,
  InputNumber,
  Select,
  Upload,
  Button
} from 'element-react';
import styles from './index.less';
import { css } from 'emotion';
import camera from 'images/profile/camera.png';
import { toast } from 'react-toastify';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';

const ProfileEditScreen = (props) => {
  let history = useHistory();
  const {address, token, location} = props;
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  const [form, setForm] = useState({
    avatorUrl: null
  });
  const datas = location?.state?.datas
  console.log(location,'location')
  const renderFormItem = (label, item) => {
    console.log(label, 'label');
    return (
      <div className={styles.styleFormItemContainer}>
        <div className={styles.label}>{label}</div>
        {item}
      </div>
    );
  };
  const handleAvatarScucess = (file) => {
    console.log(3132131, file);
    // return;
    setForm({
      ...form,
      avatorUrl: file,
    });
    setImageUrl(URL.createObjectURL(file));
  };
  const beforeAvatarUpload = (file) => {
    console.log(file);
    const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif';
    if (!isJPG) {
      toast.warn('上传图片格式!', {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    setImageUrl(URL.createObjectURL(file));

    return isJPG;
  };
  const editProfile = async () => {
    console.log(form,'form')
    setLoading(true)
    const formData = new FormData();
    // formData.append('address', address);
    formData.append('id', datas?.id)
    formData.append('avator', form?.avatorUrl);
    formData.append('nickName', form?.nickName);
    form?.twitterAddress && formData.append('twitterAddress', form?.twitterAddress);
    form?.facebookAddress && formData.append('facebookAddress', form?.facebookAddress);
    console.log(form,datas?.id,'form?.avatorUrl')
    const { data } = await post(
      '/api/v1/users/updateUser',
      formData,
      token,
      // {'Content-Type': 'application/json; charset=utf-8',}
    );
    console.log(data,'data')
    if(data?.success === true) {
      toast.success('Successfully modified', {
        position: toast.POSITION.TOP_CENTER,
      });
      setForm({})
      history.goBack()
    }
    setLoading(false)

  }
  console.log(imageUrl, 'imageUrl');
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles.editBox}>
          <h3>Edit profile</h3>
          <p className={styles.head}>Head portrait</p>
          <Upload
            className={styleUploadContainer1}
            multiple={false}
            showFileList={false}
            accept={'.png,.gif,.jpeg,jpg'}
            limit={1}
            httpRequest={(e) => {
              handleAvatarScucess(e.file);
            }}
          >
            {<img src={imageUrl || datas.avatorUrl || camera} className={styles.avatarImg} />}
          </Upload>
          {renderFormItem(
            'Name',
            <Input
              placeholder='e. g. David'
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
              placeholder='Please input'
              onChange={(value) => {
                setForm({
                  ...form,
                  twitterAddress: value,
                });
              }}
            />
          )}
          {renderFormItem(
            'Facebook',
            <Input
              placeholder='Please input'
              onChange={(value) => {
                setForm({
                  ...form,
                  facebookAddress: value,
                });
              }}
            />
          )}
          <Button loading={loading} className={styles.saveProfile} onClick={editProfile} type="text">Save profile</Button>
          {/* <span onClick={editProfile} className={styles.saveProfile}>Save profile</span> */}
        </div>
      </div>
    </div>
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
