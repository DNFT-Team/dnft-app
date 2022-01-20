import { Button, Dialog } from 'element-react'
import { css } from 'emotion'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { tradableNFTAbi, tradableNFTAbi721 } from 'utils/abi'
import { tradableNFTContract, tradableNFTContract721 } from 'utils/contract'
import { getWallet } from 'utils/get-wallet'
import { post } from 'utils/request'
import Web3 from 'web3'
import { useTranslation } from 'react-i18next'

const RenderOffShelfModal = (props) => {
	const { showOffShelfModal, address, token, net_env, setShowOffShelfModal, datas, historyBack } =
		props
	const [isOffLoading, setIsOffLoading] = useState(false)
	const { t } = useTranslation()

	return (
		<Dialog
			title={t('tips')}
			size="tiny"
			visible={showOffShelfModal}
			closeOnClickModal={false}
			customClass={styleOffShelfModal}
			onCancel={() => {
				setShowOffShelfModal(false)
				setIsOffLoading(false)
			}}
		>
			<Dialog.Body>
				<span>{t('tips.phase.out')}</span>
			</Dialog.Body>
			<Dialog.Footer className="dialog-footer">
				<Button
					onClick={() => {
						setShowOffShelfModal(false)
					}}
				>
					{t('cancel')}
				</Button>
				<Button
					type="primary"
					style={{ opacity: isOffLoading ? 0.5 : 1 }}
					onClick={async () => {
						try {
							setIsOffLoading(true)
							let wallet = getWallet()

							if (wallet) {
								window.web3 = new Web3(wallet)
								const is721Contract = datas?.contractType == 721

								const contractAddress = is721Contract
									? tradableNFTContract721[net_env]
									: tradableNFTContract[net_env]
								const myContract = new window.web3.eth.Contract(
									is721Contract ? tradableNFTAbi721 : tradableNFTAbi,
									contractAddress,
								)

								let offResult = await myContract.methods.off(datas?.orderId).send({
									from: address,
								})

								if (offResult) {
									const result = await post(
										'/api/v1/trans/sell_back',
										{
											orderId: datas?.orderId,
											tokenAddress: datas?.tokenAddress,
										},
										token,
									)
									setShowOffShelfModal(false)
									setIsOffLoading(false)
									historyBack()
									toast.info(t('toast.operation.success'), {
										position: toast.POSITION.TOP_CENTER,
									})
								}
							}
						} finally {
							setIsOffLoading(false)
						}
					}}
				>
					{isOffLoading ? t('loading') : t('confirm')}
				</Button>
			</Dialog.Footer>
		</Dialog>
	)
}
export default RenderOffShelfModal
const styleOffShelfModal = css`
	max-width: 564px;
	width: calc(100% - 40px);
`
