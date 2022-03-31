import globalConfig from '../config'

const isMainNet = globalConfig.net_env === 'mainnet'

export const tokenContract = {
	mainnet: '0x018f49822d593f88843777e0956af74c87012219',
	testnet: '0xe7B6570553e04b865a95C2B93dE31693A1E5EF3a',
}

export const nftContract = {
	mainnet: '0x854714E65bBa4Ea0b990483e439Aa428DCb2Cad1',
	testnet: '0x9CC6276baa2d8BD670114Cf14BafAd93BED393b8',
}

export const firstStakeContract = {
	mainnet: '0x736b80804069eb7179762a76fb57acc135507ee5',
	testnet: '0xE678e3CFaA3990258bB2F453252a6fC806A3e1b8',
}

export const secondStakeConTract = {
	mainnet: '0x39e020713b8298e23b8dcdf7c94515ad8da1c388',
	testnet: '0x79D03feC9840Db078A11d1D9935E0D082a500901',
}

export const thirdStakeConTract = {
	mainnet: '0xacd3cc608b64bec0ee515d69c6079d567a5665c1',
	testnet: '0x0D739117730f543e960587F3109Ea16c96682b29',
}

// bridge
export const NERVE_WALLET_ADDR = 'NERVEepb62r5fqkgdm5gbNZTkCZHrNFr9EVjeE'

// token dnf eth
export const TOKEN_DNF = {
	tokenContract: '0x7c8911c69257c074593fd9efdc431f200be27107',
	abi: [
		{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'owner', type: 'address' },
				{ indexed: true, internalType: 'address', name: 'spender', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
			],
			name: 'Approval',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
				{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
			],
			name: 'Transfer',
			type: 'event',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'owner', type: 'address' },
				{ internalType: 'address', name: 'spender', type: 'address' },
			],
			name: 'allowance',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'spender', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'approve',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
			name: 'balanceOf',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'decimals',
			outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'spender', type: 'address' },
				{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
			],
			name: 'decreaseAllowance',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'spender', type: 'address' },
				{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
			],
			name: 'increaseAllowance',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [],
			name: 'name',
			outputs: [{ internalType: 'string', name: '', type: 'string' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'symbol',
			outputs: [{ internalType: 'string', name: '', type: 'string' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [],
			name: 'totalSupply',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			stateMutability: 'view',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'recipient', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'transfer',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			inputs: [
				{ internalType: 'address', name: 'sender', type: 'address' },
				{ internalType: 'address', name: 'recipient', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'transferFrom',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			stateMutability: 'nonpayable',
			type: 'function',
		},
	],
}

export const NERVE_BRIDGE = {
	// tokenContract: '0x6758d4C4734Ac7811358395A8E0c3832BA6Ac624',
	abi: [
		{
			inputs: [{ internalType: 'address[]', name: '_managers', type: 'address[]' }],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'constructor',
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'from', type: 'address' },
				{ indexed: false, internalType: 'string', name: 'to', type: 'string' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ indexed: false, internalType: 'address', name: 'ERC20', type: 'address' },
			],
			name: 'CrossOutFunds',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'from', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'DepositFunds',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [
				{ indexed: false, internalType: 'address', name: 'to', type: 'address' },
				{ indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
			],
			name: 'TransferFunds',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'string', name: 'txKey', type: 'string' }],
			name: 'TxManagerChangeCompleted',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'string', name: 'txKey', type: 'string' }],
			name: 'TxUpgradeCompleted',
			type: 'event',
		},
		{
			anonymous: false,
			inputs: [{ indexed: false, internalType: 'string', name: 'txKey', type: 'string' }],
			name: 'TxWithdrawCompleted',
			type: 'event',
		},
		{ payable: true, stateMutability: 'payable', type: 'fallback' },
		{
			constant: true,
			inputs: [],
			name: 'allManagers',
			outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: false,
			inputs: [],
			name: 'closeUpgrade',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: false,
			inputs: [
				{ internalType: 'string', name: 'txKey', type: 'string' },
				{ internalType: 'address[]', name: 'adds', type: 'address[]' },
				{ internalType: 'address[]', name: 'removes', type: 'address[]' },
				{ internalType: 'uint8', name: 'count', type: 'uint8' },
				{ internalType: 'bytes', name: 'signatures', type: 'bytes' },
			],
			name: 'createOrSignManagerChange',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: false,
			inputs: [
				{ internalType: 'string', name: 'txKey', type: 'string' },
				{ internalType: 'address', name: 'upgradeContract', type: 'address' },
				{ internalType: 'bytes', name: 'signatures', type: 'bytes' },
			],
			name: 'createOrSignUpgrade',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: false,
			inputs: [
				{ internalType: 'string', name: 'txKey', type: 'string' },
				{ internalType: 'address payable', name: 'to', type: 'address' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'bool', name: 'isERC20', type: 'bool' },
				{ internalType: 'address', name: 'ERC20', type: 'address' },
				{ internalType: 'bytes', name: 'signatures', type: 'bytes' },
			],
			name: 'createOrSignWithdraw',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: false,
			inputs: [
				{ internalType: 'string', name: 'to', type: 'string' },
				{ internalType: 'uint256', name: 'amount', type: 'uint256' },
				{ internalType: 'address', name: 'ERC20', type: 'address' },
			],
			name: 'crossOut',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			payable: true,
			stateMutability: 'payable',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'current_min_signatures',
			outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ internalType: 'address', name: '_manager', type: 'address' }],
			name: 'ifManager',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ internalType: 'string', name: 'txKey', type: 'string' }],
			name: 'isCompletedTx',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [{ internalType: 'address', name: 'ERC20', type: 'address' }],
			name: 'isMinterERC20',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'max_managers',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'owner',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'rate',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: false,
			inputs: [{ internalType: 'address', name: 'ERC20', type: 'address' }],
			name: 'registerMinterERC20',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'signatureLength',
			outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: false,
			inputs: [{ internalType: 'address', name: 'ERC20', type: 'address' }],
			name: 'unregisterMinterERC20',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'upgrade',
			outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: true,
			inputs: [],
			name: 'upgradeContractAddress',
			outputs: [{ internalType: 'address', name: '', type: 'address' }],
			payable: false,
			stateMutability: 'view',
			type: 'function',
		},
		{
			constant: false,
			inputs: [],
			name: 'upgradeContractS1',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
		{
			constant: false,
			inputs: [{ internalType: 'address', name: 'ERC20', type: 'address' }],
			name: 'upgradeContractS2',
			outputs: [],
			payable: false,
			stateMutability: 'nonpayable',
			type: 'function',
		},
	],
}

// igo

export const igoContract = {
	mainnet: '0x7c8911c69257c074593fD9EFDC431F200be27107',
	testnet: '0x7689EbFFB41C5B12F749aA26283a1877685Fe439',
}

export const nft1155Contract = {
	mainnet: '0x854714e65bba4ea0b990483e439aa428dcb2cad1',
	testnet: '0xe5a2758146bea3422532eeB537bE230113bacDd7',
}

export const busdContract = {
	mainnet: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
	testnet: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
}

export const createNFTContract1155 = {
	testnet: '0x512D2346F2a418baf587a3160DFeab0421D765Ba',
	devnet: '0x8636C6208bC28BEed85FA9B3dBbfdAE93837f5dE',
	mainnet: '0x7c69e4Fa4100B15dBA8a0e48672de815f6Cf66aB',
}
export const createNFTContract721 = {
	testnet: '0x47cd52E61e3210FF86d797162ba03474dD304E00',
	devnet: '0xf5269E47914926D61623dE7a18dA20eaf1bf9A0a',
	mainnet: '0x576dcC13ea8425D489b3d0dF96127AD9c73F39ad',
}
export const tradableNFTContract = {
	testnet: '0xE2D09c4b9A90ecff875D1e7178CD7752cf89bA36',
	devnet: '0x05246Bc580EBa77e31e14bB60f97bAcFb705287b',
	mainnet: '0xEc26079f3D753B13722183C32d32b12E9Ba2066B',
}
export const tradableNFTContract721 = {
	testnet: '0x4EcEacF738fe8De28249707aaf6d0E182Bc1915E',
	devnet: '0xC75a7A776f2adaC07E04F0a68A01848f40769E3b',
	mainnet: '0x3dB3638F94bb8731789e8Ec2082Ee08f95581929',
}

// bsc-token(DNF)
export const bscTestTokenContact = {
	testnet: '0x18d68a172b6662aa9ef2b3376980e941d964d942',
	devnet: '0x18d68a172b6662aa9ef2b3376980e941d964d942',
	mainnet: '0x018f49822d593f88843777e0956af74c87012219',
}
// bsc-token(BUSD)
export const busdMarketContract = {
	testnet: '0xd4e4267fBf3D62d643e808067885ac10f5EB60bD',
	devnet: '0xd4e4267fBf3D62d643e808067885ac10f5EB60bD',
	mainnet: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
}

export const auction721Contract = {
	testnet: '0x942b11A8A44777aA00F0eB5241D15721e63A09E2',
	devnet: '0x942b11A8A44777aA00F0eB5241D15721e63A09E2',
	mainnet: '0x942b11A8A44777aA00F0eB5241D15721e63A09E2',
}

export const blindBox721Contract = {
	testnet: '0xa3b6967F8eb5397831e007B542758D209Dc2e182',
	devnet: '0x139d6E0F3A9d8B563a012F2daC33d5282BB51877',
}

export const blindBoxApproveContract = {
	testnet: '0xfB1927c7923f23e18375038179E8E61a09617037',
	devnet: '0x55d398326f99059fF775485246999027B3197955',
}
