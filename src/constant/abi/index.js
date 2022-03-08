import Web3 from 'web3'

import tokenAbi from './tokenAbi.json'
import auction721Abi from './auction721Abi.json'

const getWeb3Instance = (provider) => {
	if (!provider) {
		provider = window.ethereum
	}
	return new Web3(provider)
}

export const InstanceDNFBSC = (provider = null) => {
	const web3 = getWeb3Instance(provider)
	return new web3.eth.Contract(tokenAbi, process.env.REACT_APP_C_DNF_BSC)
}

export const InstanceBUSD = (provider = null) => {
	const web3 = getWeb3Instance(provider)
	return new web3.eth.Contract(tokenAbi, process.env.REACT_APP_C_BUSD)
}

export const InstanceAuction721 = (provider = null) => {
	const web3 = getWeb3Instance(provider)
	return new web3.eth.Contract(auction721Abi, process.env.REACT_APP_C_AUTCION721)
}
