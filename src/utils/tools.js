import { isAddress } from 'web3-utils'
import isIPFS from 'is-ipfs'
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

const previewBaseUrl = process.env.REACT_APP_IPFS_PREVIEW
const desiredGatewayPrefix = process.env.REACT_APP_IPFS_GATEWAY
const convertToDesiredGateway = (sourceUrl) => {
	try {
		// Case inner url : ipfsGet/cid | /ipfsGet/cid
		if (/ipfsGet\//.test(sourceUrl)) {
			return previewBaseUrl + sourceUrl.replace('/ipfsGet', '')
		}

		const results = containsCID(sourceUrl)
		if (results.containsCid !== true) {
			throw new Error('url does not contain CID')
		}

		const splitUrl = sourceUrl.split(results.cid)
		const append = `${results.cid}${splitUrl[1]}${splitUrl?.[2] || ''}`
		// case 1 - the ipfs://cid path
		if (sourceUrl.includes(`ipfs://${results.cid}`)) {
			return desiredGatewayPrefix
				? `${desiredGatewayPrefix}/ipfs/${append}`
				: `${previewBaseUrl}/${append}`
		}

		// case 2 - the /ipfs/cid path (this should cover ipfs://ipfs/cid as well
		if (sourceUrl.includes(`/ipfs/${results.cid}`)) {
			return desiredGatewayPrefix
				? `${desiredGatewayPrefix}/ipfs/${append}`
				: `${previewBaseUrl}/${append}`
		}

		// case 3 - the /ipns/cid path
		if (sourceUrl.includes(`/ipns/${results.cid}`)) {
			return desiredGatewayPrefix
				? `${desiredGatewayPrefix}/ipns/${append}`
				: `${previewBaseUrl}/${append}`
		}
	} catch {
		return false
	}
}

const containsCID = (url) => {
	if (typeof url !== 'string') {
		throw new Error('url is not string')
	}
	const splitUrl = url.split('/')
	for (const split of splitUrl) {
		if (isIPFS.cid(split)) {
			return {
				containsCid: true,
				cid: split,
			}
		}
	}
	return {
		containsCid: false,
		cid: null,
	}
}

export const getImgLink = (url) => {
	//	Case noImg
	if (!url || url.indexOf('undefined') > -1 || url.indexOf('null') > -1) {
		return noImg
	}

	// Case outer url : http:// | https:// | data:image:
	if (/^http:\/\/|https:\/\/|data:image:/.test(url)) {
		return url
	}

	// Case ipfs
	const checkIpfsUrl = convertToDesiredGateway(url)

	return checkIpfsUrl || noImg
}

export const queryParse = (query) => {
	query = query.substring(query.indexOf('?') + 1)
	let arry = query.split('&')
	let params = {}
	arry.forEach((item) => {
		let key = item.substring(0, item.indexOf('='))
		let val = item.substring(item.indexOf('=') + 1)
		params[key] = val
	})
	return params
}
export const json2File = (json, fileName) => {
	const content = JSON.stringify(json)
	const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
	const jsonFile = new File([blob], fileName, {
		lastModified: Date.now(),
	})
	return jsonFile
}
