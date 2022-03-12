import React, { useEffect, useState } from 'react'
import { css } from 'emotion'

const durationFormatter = (time) => {
	if (!time) {
		return { ss: 0 }
	}
	let t = time
	const ss = t % 60
	t = (t - ss) / 60
	if (t < 1) {
		return { ss }
	}
	const mm = t % 60
	t = (t - mm) / 60
	if (t < 1) {
		return { mm, ss }
	}
	const hh = t % 24
	t = (t - hh) / 24
	if (t < 1) {
		return { hh, mm, ss }
	}
	const dd = t
	return { dd, hh, mm, ss }
}

export default function CountDown(props) {
	const { time, isMilliSecond } = props
	const mathTime = isMilliSecond ? Math.round(+time / 1000) : Math.round(+time)

	const [duration, setDuration] = useState(mathTime)
	const [_dateTimes, setDateTimes] = useState([0, 0, 0, 0])

	useEffect(() => {
		const timer = setTimeout(() => {
			if (duration < 0) {
				return
			}
			const { dd, hh, mm, ss } = durationFormatter(duration)
			setDateTimes([dd, hh, mm, ss])
			// console.log(_dateTimes, duration)
			setDuration(duration - 1)
		}, 1000)
		return () => clearTimeout(timer)
	})

	return (
		<div className={styleCountDown}>
			<div>
				<strong>{_dateTimes[0] || 0}</strong>
				<p className="subText">DAY</p>
			</div>
			<div>
				<strong>{_dateTimes[1] || 0}</strong>
				<p className="subText">HOURS</p>
			</div>
			<div>
				<strong>{_dateTimes[2] || 0}</strong>
				<p className="subText">MINUTES</p>
			</div>
			{/* <div>
				<strong>{_dateTimes[3]}</strong>
				<p className="subText">SECONDS</p>
			</div> */}
		</div>
	)
}

const styleCountDown = css`
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	div {
		display: flex;
		flex-flow: column nowrap;
		margin: 0 1rem;
		position: relative;
	}
	div:nth-child(2) {
		text-align: center;
		&::before,
		&::after {
			position: absolute;
			content: ':';
			top: 0;
		}
		&::before {
			left: -1rem;
		}
		&::after {
			right: -1rem;
		}
	}
`
