import api_ethers from './api_ethers'
const nerve = require('nerve-sdk-js/src/index');
const sdk = require('nerve-sdk-js/src/api/sdk');
const {Plus, timesDecimals} = require('../config/htgConfig');
const http = require('../http/rpc.js');
// const api_ethers = require('./api_ethers');

// NERVE 测试网信息
// const NERVE_INFO = {
//     chainId: 5,
//     assetId: 1,
//     prefix: "TNVT",
//     symbol: "NVT",
//     decimals: 8,
//     blackHolePublicKey: "000000000000000000000000000000000000000000000000000000000000000000",
//     blockHoleAddress: "TNVTdTSPGwjgRMtHqjmg8yKeMLnpBpVN5ZuuY",
//     feePubkey: "111111111111111111111111111111111111111111111111111111111111111111"
// };
// NERVE 主网信息
const NERVE_INFO = {
    chainId: 9,
    assetId: 1,
    prefix: "NERVE",
    symbol: "NVT",
    decimals: 8,
    blackHolePublicKey: "000000000000000000000000000000000000000000000000000000000000000000",
    blockHoleAddress: "NERVEepb63T1M8JgQ26jwZpZXYL8ZMLdUAK31L",
    feePubkey: "111111111111111111111111111111111111111111111111111111111111111111"
};

/**
 * 获取inputs and outputs
 * @param transferInfo
 * @returns {*}
 **/
async function inputsOrOutputs(transferInfo) {
    let withdrawalBalance = await getNulsBalance(transferInfo.fromAddress, transferInfo.chainId, transferInfo.assetId);
    let mainBalance = await getNulsBalance(transferInfo.fromAddress, NERVE_INFO.chainId, NERVE_INFO.assetId);

    let newFee = Number(timesDecimals(Plus(transferInfo.withdrawalFee, transferInfo.fee), NERVE_INFO.decimals));
    let newAmount = Number(Plus(transferInfo.amount, newFee));
    let inputs = [];
    if (transferInfo.chainId === NERVE_INFO.chainId && transferInfo.assetId === NERVE_INFO.assetId) {
        inputs.push({
            address: transferInfo.fromAddress,
            amount: newAmount,
            assetsChainId: transferInfo.chainId,
            assetsId: transferInfo.assetId,
            nonce: withdrawalBalance.data.nonce,
            locked: 0,
        });
    } else {
        inputs = [
            {
                address: transferInfo.fromAddress,
                amount: transferInfo.amount,
                assetsChainId: transferInfo.chainId,
                assetsId: transferInfo.assetId,
                nonce: withdrawalBalance.data.nonce,
                locked: 0,
            },
            {
                address: transferInfo.fromAddress,
                amount: newFee,
                assetsChainId: NERVE_INFO.chainId,
                assetsId: NERVE_INFO.assetId,
                nonce: mainBalance.data.nonce,
                locked: 0,
            }
        ];
    }


    let feeAddress = nerve.getAddressByPub(NERVE_INFO.chainId, NERVE_INFO.assetId, NERVE_INFO.feePubkey, NERVE_INFO.prefix);

    let outputs = [
        {
            address: NERVE_INFO.blockHoleAddress, //黑洞地址
            amount: transferInfo.amount,
            assetsChainId: transferInfo.chainId,
            assetsId: transferInfo.assetId,
            locked: 0
        },
        {
            address: feeAddress, //提现费用地址
            amount: Number(timesDecimals(transferInfo.withdrawalFee, NERVE_INFO.decimals)),
            assetsChainId: NERVE_INFO.chainId,
            assetsId: NERVE_INFO.assetId,
            locked: 0
        },
    ];
    return {success: true, data: {inputs: inputs, outputs: outputs}};
}

/**
 * 异构链提现交易
 */
export const withdrawalTest = async (pri, fromAddress, toAddress, heterogeneousChainId, assetsChainId, assetsId, withdrawalAmount, withdrawalDecimals, withdrawalFeeOfNVT, remark)=> {
    let newAmount = timesDecimals(withdrawalAmount, withdrawalDecimals);
    let transferInfo = {
        fromAddress: fromAddress,
        toAddress: toAddress,
        withdrawalFee: Number(withdrawalFeeOfNVT),
        fee: 0.001,
        chainId: assetsChainId,
        assetId: assetsId,
        amount: newAmount,
    };
    let inOrOutputs = await inputsOrOutputs(transferInfo);
    if (!inOrOutputs.success) {
        throw "inputs、outputs组装错误";
    }
    console.log(transferInfo, inOrOutputs);
    let tAssemble = await nerve.transactionAssemble(
        inOrOutputs.data.inputs,
        inOrOutputs.data.outputs,
        remark,
        43,
        {
            heterogeneousAddress: toAddress,
            heterogeneousChainId: heterogeneousChainId
        }
    );
    //获取hash
    let hash = await tAssemble.getHash();

    //交易签名
    let txSignature = await sdk.getSignData(hash.toString('hex'), pri);
    //通过拼接签名、公钥获取HEX
    let signData = await sdk.appSplicingPub(txSignature.signValue, sdk.getPub(pri));
    tAssemble.signatures = signData;
    let txhex = tAssemble.txSerialize().toString("hex");
    console.log('txhex',txhex.toString('hex'));
    return txhex
    // let result = await validateTx(txhex);
    // if (result.success) {
    //     console.log(result.data.value);
    //     let results = await broadcastTx(txhex);
    //     if (results && results.value) {
    //         console.log("交易完成")
    //     } else {
    //         console.log("广播交易失败: " + JSON.stringify(results))
    //     }
    // } else {
    //     console.log("验证交易失败:" + JSON.stringify(result.error))
    // }
}

// NERVE 网络资产信息
const NERVE_ASSET_INFO = {
    testnet: {
        nvt: {
            chainId: 5,
            assetId: 1
        },
        eth: {
            chainId: 5,
            assetId: 2
        },
        bnb: {
            chainId: 5,
            assetId: 8
        },
        ht: {
            chainId: 5,
            assetId: 9
        },
        okt: {
            chainId: 5,
            assetId: 12
        }
    },
    mainnet: {
        nvt: {
            chainId: 9,
            assetId: 1
        },
        eth: {
            chainId: 9,
            assetId: 2
        },
        bnb: {
            chainId: 9,
            assetId: 25
        },
        ht: {
            chainId: 9,
            assetId: 55
        },
        okt: {
            chainId: 9,
            assetId: 87
        }
    }
};

export const getWithdrawalFee = async (chain)=>{
    let isMainnet = true;
    let provider = api_ethers.getProvider(chain.toUpperCase(), isMainnet ? "main" : "test");
    let net = isMainnet ? "mainnet" : "testnet";
    let nvt = NERVE_ASSET_INFO[net].nvt;
    let htg = NERVE_ASSET_INFO[net][chain.toLowerCase()];
    let nvtPrice = await getSymbolPriceOfUsdt(nvt.chainId, nvt.assetId);
    let htgPrice = await getSymbolPriceOfUsdt(htg.chainId, htg.assetId);
    let result = await api_ethers.calNVTOfWithdrawTest(provider, nvtPrice, htgPrice, true);
    let nvtNumber =  api_ethers.formatNVT(result);
    console.log(`提现到${chain}网络:` + nvtNumber);
    return nvtNumber
}

/**
 * 获取账户的余额及nonce
 * @param address
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getNulsBalance = async (address, chainId = 5, assetId = 1) => {
    return await http.post('/', 'getAccountBalance', [chainId, assetId, address])
        .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
                console.log(`${chainId}|${assetId} balance:`,response.result.balance);
                return {success: true, data: {balance: response.result.balance, nonce: response.result.nonce}}
            } else {
                return {success: false, data: response}
            }
        })
        .catch((error) => {
            return {success: false, data: error};
        });
}
/**
 * 验证交易
 * @param txHex
 * @returns {Promise<AxiosResponse<any>>}
 */
export const validateTx = async (txHex) => {
    return await http.post('/', 'validateTx', [txHex])
        .then((response) => {
            //console.log(response);
            if (response.hasOwnProperty("result")) {
                return {success: true, data: response.result};
            } else {
                return {success: false, error: response.error};
            }
        })
        .catch((error) => {
            return {success: false, error: error};
        });
}
/**
 * 广播交易
 * @param txHex
 * @returns {Promise<AxiosResponse<any>>}
 */
export const broadcastTx = async (txHex)=> {
    return await http.post('/', 'broadcastTx', [txHex])
        .then((response) => {
            if (response.hasOwnProperty("result")) {
                return response.result;
            } else {
                return response.error;
            }
        })
        .catch((error) => {
            return {success: false, data: error};
        });
}
/**
 * 查询资产的USD价格
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSymbolPriceOfUsdt = async (chainId, assetId)=>{
    return await http.postComplete('/', 'getBestSymbolPrice', [chainId, assetId])
        .then((response) => {
            if (response.hasOwnProperty("result")) {
                return response.result;
            } else {
                return response.error;
            }
        })
        .catch((error) => {
            return {success: false, data: error};
        });
}

