const baseSize = 24
export const setRem = () => {
	const scale = document.documentElement.clientWidth / 750
	document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
