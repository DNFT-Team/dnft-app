import React, { useMemo } from 'react'
import { css, cx } from 'emotion'

export const STEP_ENUM = {
	INITIAL: 0,
	// Sensitive Detection
	SENSI_PENDING: 1,
	SENSI_FAILED: 2,
	//  Upload Imgae Via IPFS
	IMAGE_PENDING: 3,
	IMAGE_FAILED: 4,
	//  Upload JSON Via IPFS
	JSON_PENDING: 5,
	JSON_FAILED: 6,
	// Mint NFT Via Contract
	MINT_PENDING: 7,
	MINT_FAILED: 8,
	END: 9,
}

const loops = [
	['SENSI', 'Sensitive Detection'],
	['IMAGE', 'Upload Media Source'],
	['JSON', 'Upload MetaData'],
	['MINT', 'Mint NFT'],
]

const getItemStyle = (i, step) =>
	2 * i + 1 === step
		? StepStyle.StepLoading // 1,3,5,7
		: 2 * (i + 1) === step
		? StepStyle.StepFailed // 2,4,6,8
		: 2 * (i + 1) < step
		? StepStyle.StepSuccess // 2,4,6,8
		: false

const StepCard = (props) => {
	const { step, errMsg, onBack, onClose } = props

	console.log('[ props.step ]', step)

	const renderCaseProcess = useMemo(
		() => (
			<section className={StepStyle.Wrapper}>
				<div className={StepStyle.Steps}>
					{loops.map((st, i) => (
						<div key={i} className={cx(StepStyle.StepItem, getItemStyle(i, step))}>
							<span>{`${i + 1}.${st[1]}`}</span>
							<i />
						</div>
					))}
					{errMsg && (
						<div className={StepStyle.ActionLine}>
							<p>{errMsg}</p>
							<button onClick={onBack}>Back</button>
						</div>
					)}
				</div>
			</section>
		),
		[step, errMsg],
	)

	const renderCaseCelabrate = useMemo(() => (
		<section className={StepStyle.EndWrapper}>
			<h3>
				Success! <br />
				See this NFT in your wallet.
			</h3>
			<div className={StepStyle.ActionLine}>
				<button onClick={onClose}>CLose</button>
			</div>
		</section>
	))
	return step === STEP_ENUM.INITIAL
		? null
		: step === STEP_ENUM.END
		? renderCaseCelabrate
		: renderCaseProcess
}

export default StepCard

const StepStyle = {
	Wrapper: css`
		background: #fff;
	`,
	EndWrapper: css`
		background: #fff;
		height: 40vh;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: center;
		h3 {
			text-align: center;
			font-family: Helvetica;
			font-style: normal;
			font-weight: bold;
			font-size: 20px;
			line-height: 30px;
		}
	`,
	Steps: css`
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		flex-grow: 1;
		height: 100%;
		box-sizing: border-box;
	`,
	StepItem: css`
		font-family: Helvetica;
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 1rem 0;
		border: 2px solid #e1e6ff;
		border-radius: 12px;
		padding: 10px;
		i {
			height: 10px;
			width: 10px;
			display: inline-block;
			border-radius: 100%;
			margin-right: 1rem;
			background: #e1e6ff;
		}
	`,
	StepLoading: css`
		i {
			background: #0057d9;
			position: relative;
			transform: matrix(0.707, 0.707, -0.707, 0.707, 0, 0);
			border-radius: 20%;
			animation: rotate infinite 2s ease-in-out;
			@keyframes rotate {
				100% {
					transform: rotate(360deg);
				}
				0% {
					transform: rotate(0deg);
				}
			}
		}
	`,
	StepSuccess: css`
		i {
			background: #13ce66;
		}
	`,
	StepFailed: css`
		i {
			background: #ff4949;
		}
	`,
	ActionLine: css`
		text-align: center;
		p {
			font-family: Helvetica;
			font-style: normal;
			font-weight: bold;
			font-size: 18px;
			color: #ff4949;
			margin-bottom: 1.4rem;
		}
		button {
			background: #0057d9;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			height: 40px;
			padding: 10px 8px;
			min-width: 120px;
			border-radius: 10px;
			font-family: Archivo Black, sans-serif;
			font-style: normal;
			font-weight: normal;
			font-size: 14px;
			line-height: 14px;
			color: #fcfcfd;
			cursor: pointer;
			user-select: none;
			@media (max-width: 900px) {
				width: 100%;
				margin-top: 20px;
			}
		}
	`,
}
