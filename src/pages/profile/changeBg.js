import React, { useEffect, useState, useRef } from 'react'
import { Dialog, Input, Upload, Button } from 'element-react'
import styles from './index.less'
import { css } from 'emotion'
import { toast } from 'react-toastify'
import { post } from 'utils/request'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { ipfs_post } from 'utils/ipfs-request'
import globalConf from 'config/index'
import CropperBox from 'components/CropperBox'
import upload_icon from 'images/profile/upload_icon.png'
import { file } from '@babel/types'
import {
	getMyProfileList,
	getMyProfileBatch,
	getMyProfileCreated,
	getMyProfileOwned,
} from 'reduxs/actions/profile'
import { useTranslation } from 'react-i18next'

const ProfileByScreen = (props) => {
	const { token, datas, onClose, onSuccess, visible, newAddress, dispatch, onOpen } = props
	const [loading, setLoading] = useState(false)
	const [profileFile, setProfileFile] = useState(null)
	const { t } = useTranslation()

	const [srcCropper, setSrcCropper] = useState('')
	const [cropperVisible, setCropperVisible] = useState(false)

	const [form, setForm] = useState({})

	useEffect(() => {
		setForm({
			avatorUrl: datas?.bannerUrl,
		})
	}, [datas])

	const beforeAvatarUpload = (file) => {
		const reader = new FileReader()
		const isLt15M = file.size / 1024 / 1024 < 15
		if (!isLt15M) {
			toast.warn(t('cropImg.unpoaded.size.limit15'))
			return
		}
		reader.readAsDataURL(file)
		reader.onload = (e) => {
			setSrcCropper(e.target.result)
			setCropperVisible(true)
			onClose()
		}
		return false
	}

	const cropperBtn = (dataUrl, file) => {
		setCropperVisible(false)
		onOpen()
		setProfileFile(file)
		setForm({ ...form, avatorUrl: dataUrl })
	}
	const onSubmit = async () => {
		setLoading(true)
		let ipfsHash = datas?.bannerUrl
		if (profileFile) {
			try {
				const fileData = new FormData()
				fileData.append('file', profileFile)
				const data = await ipfs_post('/v0/add', fileData)
				ipfsHash = globalConf.ipfsDown + data?.data?.['Hash']
				if (!ipfsHash) {
					toast.error(t('toast.ipfs.upload.failed'))
					setLoading(false)
					return
				}
				if (ipfsHash) {
					toast.success(t('toast.ipfs.upload.success'), {
						position: toast.POSITION.TOP_CENTER,
					})
				}
			} catch (e) {
				console.log(e)
			}
		}

		try {
			const data1 = await post(
				'/api/v1/users/updateUserBanner',
				{
					address: newAddress,
					bannerUrl: ipfsHash,
				},
				token,
			)
			data1 &&
				toast.success(t('toast.banner.update.success'), {
					position: toast.POSITION.TOP_CENTER,
				})
			setLoading(false)
			setForm({})
			setProfileFile(null)
			dispatch(getMyProfileList({ userId: newAddress }, token))
			onSuccess()
		} catch (e) {
			setLoading(false)
		}
	}

	return (
		<React.Fragment>
			<Dialog
				title={t('profile.setting.background')}
				visible={visible}
				customClass={styleModalContainer}
				onCancel={onClose}
			>
				<Dialog.Body style={{ paddingBottom: 0 }}>
					<div className="limit">
						<i>{t('profile.upload.img')}</i>
						<span>{t('profile.suggest.size')}</span>
						<span>{t('profile.max.2mb')}</span>
					</div>
					<Upload
						className={styleUploadContainer1}
						multiple={false}
						showFileList={false}
						accept={'.png,.gif,.jpeg,.jpg,.svg'}
						action=""
						beforeUpload={(file) => beforeAvatarUpload(file)}
					>
						{form?.avatorUrl ? (
							<img src={form?.avatorUrl} className={'avatarImg'} />
						) : (
							<div className="upload_icon">
								<img src={upload_icon} />
								<span>PNG, JPG</span>
							</div>
						)}
					</Upload>
				</Dialog.Body>
				<Dialog.Footer
					style={{
						textAlign: 'center',
					}}
				>
					<Button loading={loading} className={styleModalContainerBtn} onClick={onSubmit}>
						{t('save')}
					</Button>
				</Dialog.Footer>
			</Dialog>
			<CropperBox
				visible={cropperVisible}
				srcCropper={srcCropper}
				aspectRatio={1800 / 300}
				onCloseModal={() => {
					onOpen()
					setCropperVisible(false)
				}}
				cropperBtn={cropperBtn}
			/>
		</React.Fragment>
	)
}

const mapStateToProps = ({ profile }) => ({
	address: profile.address,
	chainType: profile.chainType,
	token: profile.token,
})
export default withRouter(connect(mapStateToProps)(ProfileByScreen))

const styleUploadContainer1 = css`
	margin-bottom: 30px;
	.el-upload-dragger {
		display: flex;
		flex-direction: column;
		color: #777e90;
		height: 108px;
		width: 435px;
		border-radius: 50%;
		justify-content: center;
		border: none;
		.el-upload__text {
			margin-top: 10px;
		}
	}
	.el-upload {
		width: 100%;
		height: 108px;
		border-radius: 10px;
		background: #e5e5e5;
		overflow: hidden;
	}
	.avatar {
		background: #fbfdff;
	}
	.avatarImg {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`
const styleModalContainer = css`
	max-width: 564px;
	width: calc(100% - 40px);
	border-radius: 10px;
	// height: 80vh;
	overflow: auto;
	.el-dialog__title {
		color: #11142d;
		font-family: Archivo Black;
		font-style: normal;
		font-weight: normal;
		font-size: 24px;
		line-height: 24px;
	}
	.el-dialog__header {
		padding: 30px 30px 0px 30px;
	}
	.el-dialog__body {
		padding: 30px;
	}
	.el-dialog__headerbtn .el-dialog__close {
		color: #1b1d21;
		font-weight: bold;
		font-size: 16px;
	}
	.el-input__inner {
		border: 2px solid #e1e6ff;
		height: 40px;
	}
	.el-dialog__footer {
		padding: 0px;
		margin-bottom: 10px;
	}
	.upload_icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		img {
			width: 18px;
			margin-top: 36px;
		}
		span {
			font-family: Helvetica;
			font-style: normal;
			font-weight: normal;
			font-size: 12px;
			line-height: 12px;
			color: #888888;
			margin-top: 16px;
		}
	}
	.limit {
		margin-bottom: 30px;
		i {
			font-family: Helvetica;
			font-style: normal;
			font-weight: bold;
			font-size: 14px;
			line-height: 14px;
			color: #000000;
			padding-right: 13px;
			&:after {
				content: '*';
				font-size: 16px;
				padding-left: 4px;

				color: #ff4242;
			}
		}
		span {
			font-family: Helvetica;
			font-style: normal;
			font-weight: normal;
			font-size: 12px;
			line-height: 12px;
			text-align: center;
			color: #888888;
			padding-right: 17px;
		}
	}
`
const styleModalContainerBtn = css`
	width: 150px;
	height: 40px;
	margin: 0 auto;
	background: #0057d9;
	border-radius: 5px;
	margin-bottom: 20px;
	font-size: 16px;
	font-family: Archivo Black;
	border-radius: 5px;
	outline: none;
	color: #fcfcfd;
	border: 0;
	&:hover {
		color: #fff;
		background: #0057d9;
	}
`
