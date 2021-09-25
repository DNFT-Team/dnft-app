import globalConfig from '../config';

const isMainNet = globalConfig.net_env === 'mainnet';

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

export const TOKEN_DNF = {
  tokenContract: '0x7c8911c69257c074593fd9efdc431f200be27107',
  abi: [{'inputs': [], 'stateMutability': 'nonpayable', 'type': 'constructor'}, {'anonymous': false, 'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'owner', 'type': 'address'}, {'indexed': true, 'internalType': 'address', 'name': 'spender', 'type': 'address'}, {'indexed': false, 'internalType': 'uint256', 'name': 'value', 'type': 'uint256'}], 'name': 'Approval', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'from', 'type': 'address'}, {'indexed': true, 'internalType': 'address', 'name': 'to', 'type': 'address'}, {'indexed': false, 'internalType': 'uint256', 'name': 'value', 'type': 'uint256'}], 'name': 'Transfer', 'type': 'event'}, {'inputs': [{'internalType': 'address', 'name': 'owner', 'type': 'address'}, {'internalType': 'address', 'name': 'spender', 'type': 'address'}], 'name': 'allowance', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'spender', 'type': 'address'}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}], 'name': 'approve', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'account', 'type': 'address'}], 'name': 'balanceOf', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [], 'name': 'decimals', 'outputs': [{'internalType': 'uint8', 'name': '', 'type': 'uint8'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'spender', 'type': 'address'}, {'internalType': 'uint256', 'name': 'subtractedValue', 'type': 'uint256'}], 'name': 'decreaseAllowance', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'spender', 'type': 'address'}, {'internalType': 'uint256', 'name': 'addedValue', 'type': 'uint256'}], 'name': 'increaseAllowance', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [], 'name': 'name', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [], 'name': 'symbol', 'outputs': [{'internalType': 'string', 'name': '', 'type': 'string'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [], 'name': 'totalSupply', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'stateMutability': 'view', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'recipient', 'type': 'address'}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}], 'name': 'transfer', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'stateMutability': 'nonpayable', 'type': 'function'}, {'inputs': [{'internalType': 'address', 'name': 'sender', 'type': 'address'}, {'internalType': 'address', 'name': 'recipient', 'type': 'address'}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}], 'name': 'transferFrom', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'stateMutability': 'nonpayable', 'type': 'function'}]
}

export const NERVE_BRIDGE = {
  tokenContract: '0x6758d4C4734Ac7811358395A8E0c3832BA6Ac624',
  abi: [{'inputs': [{'internalType': 'address[]', 'name': '_managers', 'type': 'address[]'}], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor'}, {'anonymous': false, 'inputs': [{'indexed': false, 'internalType': 'address', 'name': 'from', 'type': 'address'}, {'indexed': false, 'internalType': 'string', 'name': 'to', 'type': 'string'}, {'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {'indexed': false, 'internalType': 'address', 'name': 'ERC20', 'type': 'address'}], 'name': 'CrossOutFunds', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': false, 'internalType': 'address', 'name': 'from', 'type': 'address'}, {'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}], 'name': 'DepositFunds', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': false, 'internalType': 'address', 'name': 'to', 'type': 'address'}, {'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}], 'name': 'TransferFunds', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': false, 'internalType': 'string', 'name': 'txKey', 'type': 'string'}], 'name': 'TxManagerChangeCompleted', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': false, 'internalType': 'string', 'name': 'txKey', 'type': 'string'}], 'name': 'TxUpgradeCompleted', 'type': 'event'}, {'anonymous': false, 'inputs': [{'indexed': false, 'internalType': 'string', 'name': 'txKey', 'type': 'string'}], 'name': 'TxWithdrawCompleted', 'type': 'event'}, {'payable': true, 'stateMutability': 'payable', 'type': 'fallback'}, {'constant': true, 'inputs': [], 'name': 'allManagers', 'outputs': [{'internalType': 'address[]', 'name': '', 'type': 'address[]'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'closeUpgrade', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'string', 'name': 'txKey', 'type': 'string'}, {'internalType': 'address[]', 'name': 'adds', 'type': 'address[]'}, {'internalType': 'address[]', 'name': 'removes', 'type': 'address[]'}, {'internalType': 'uint8', 'name': 'count', 'type': 'uint8'}, {'internalType': 'bytes', 'name': 'signatures', 'type': 'bytes'}], 'name': 'createOrSignManagerChange', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'string', 'name': 'txKey', 'type': 'string'}, {'internalType': 'address', 'name': 'upgradeContract', 'type': 'address'}, {'internalType': 'bytes', 'name': 'signatures', 'type': 'bytes'}], 'name': 'createOrSignUpgrade', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'string', 'name': 'txKey', 'type': 'string'}, {'internalType': 'address payable', 'name': 'to', 'type': 'address'}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {'internalType': 'bool', 'name': 'isERC20', 'type': 'bool'}, {'internalType': 'address', 'name': 'ERC20', 'type': 'address'}, {'internalType': 'bytes', 'name': 'signatures', 'type': 'bytes'}], 'name': 'createOrSignWithdraw', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'string', 'name': 'to', 'type': 'string'}, {'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {'internalType': 'address', 'name': 'ERC20', 'type': 'address'}], 'name': 'crossOut', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'payable': true, 'stateMutability': 'payable', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'current_min_signatures', 'outputs': [{'internalType': 'uint8', 'name': '', 'type': 'uint8'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [{'internalType': 'address', 'name': '_manager', 'type': 'address'}], 'name': 'ifManager', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [{'internalType': 'string', 'name': 'txKey', 'type': 'string'}], 'name': 'isCompletedTx', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [{'internalType': 'address', 'name': 'ERC20', 'type': 'address'}], 'name': 'isMinterERC20', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'max_managers', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'rate', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'address', 'name': 'ERC20', 'type': 'address'}], 'name': 'registerMinterERC20', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'signatureLength', 'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'address', 'name': 'ERC20', 'type': 'address'}], 'name': 'unregisterMinterERC20', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'upgrade', 'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'upgradeContractAddress', 'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}], 'payable': false, 'stateMutability': 'view', 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'upgradeContractS1', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}, {'constant': false, 'inputs': [{'internalType': 'address', 'name': 'ERC20', 'type': 'address'}], 'name': 'upgradeContractS2', 'outputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function'}]
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

// asset
export const bscTestTokenContact = {
  testnet: '0x18d68a172b6662aa9ef2b3376980e941d964d942',
  devnet:'0x18d68a172b6662aa9ef2b3376980e941d964d942'
}
export const createNFTContract1155 = {
  testnet: '0xcf50211b2A67De83472dE6DcDd99ecD901Bf0dC1',
  devnet:'0x93E954c6baEDea0953d1442c2c56321b22960449'
}
export const createNFTContract721 = {
  testnet: '0x3A0fE86f5550fc5055aFe95FC0d1d35D288A9F6D',
  devnet:'0x2A432C334D6d495A30f42517e6AfAb0cCb5C06b4'
}
export const tradableNFTContract = {
  testnet: '0xE2D09c4b9A90ecff875D1e7178CD7752cf89bA36',
  devnet:'0x05246Bc580EBa77e31e14bB60f97bAcFb705287b'
}
export const tradableNFTContract721 = {
  testnet: '0x4EcEacF738fe8De28249707aaf6d0E182Bc1915E',
  devnet:'0xC75a7A776f2adaC07E04F0a68A01848f40769E3b'
}

// market
export const busdMarketContract = {
  testnet: '0xd4e4267fBf3D62d643e808067885ac10f5EB60bD',
  devnet:'0xd4e4267fBf3D62d643e808067885ac10f5EB60bD'
}
