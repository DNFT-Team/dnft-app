import { isAddress } from 'web3-utils'
import globalConf from './../config/index.js'
import noImg from 'images/common/collection_noImg.svg'

export const getObjectURL = (file) => {
	let url = null
	if (window.createObjectURL != undefined) {
		// basic
		url = window.createObjectURL(file)
	} else if (window.URL != undefined) {
		// mozilla(firefox)
		url = window.URL.createObjectURL(file)
	} else if (window.webkitURL != undefined) {
		// webkit or chrome
		url = window.webkitURL.createObjectURL(file)
	}
	return url
}

export const shortenString = (str) =>
	!str ? '' : str.length <= 11 ? str : str.substring(0, 6) + '...' + str.substring(str.length - 4)

export const shortenNameString = (str, len = 20) =>
	!str ? '' : str.length <= len ? str : str.substring(0, len) + '...'

export const shortenAddress = (address, chars = 6) => {
	const parsed = isAddress(address)
	if (!parsed) {
		console.error(`Invalid 'address' parameter '${address}'.`)
	}
	return `${address?.substring(0, chars + 1)}...${address?.substring(42 - chars)}`
}

export const getImgLink = (url) => {
	if (!url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1) {
		return noImg
	}
	if (url.indexOf('http') > -1) {
		return url
	}
	if (url.indexOf('ipfs://') > -1) {
		return url.replace('ipfs://', '/ipfsGet/')
	}
	return url
}
