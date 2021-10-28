import React, { useRef } from 'react';
import { Dialog, Button } from 'element-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { css } from 'emotion';
import { toast } from 'react-toastify';

import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const CropperBox = (props) => {
  const cropperRef = useRef(null);

  const { title = 'Crop the picture', tip = 'avatar', visible, aspectRatio = 1, srcCropper, onCloseModal, cropperBtn } = props;
  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
  const submitBtn = () => {
    const cropper = cropperRef?.current?.cropper;
    let dataUrl = cropper.getCroppedCanvas().toDataURL();
    let file = dataURLtoFile(dataUrl, 'file')
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      toast.warn(`The size of the uploaded ${tip} image cannot exceed 2MB!`, {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    cropperBtn(dataUrl, file);
  }
  return (
    <Dialog
      title={title}
      visible={visible}
      customClass={styleModalContainer}
      closeOnClickModal={false}
      onCancel={onCloseModal}
    >
      <Dialog.Body>
        <Cropper
          ref={cropperRef}
          style={{ width: '600', height: '400px' }}
          // 预览图的容器
          preview=".previewContainer"
          guides={false}
          // 固定图片裁剪比例（正方形）
          aspectRatio={aspectRatio}
          // 要裁剪的图片的路径
          src={srcCropper}
        />
      </Dialog.Body>
      <Dialog.Footer p="10 32px" justifyContent="flex-start">
        <Button className={styleModalContainerBtn} onClick={submitBtn}>Save</Button>
      </Dialog.Footer>
    </Dialog>
  )
}
const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(CropperBox));

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