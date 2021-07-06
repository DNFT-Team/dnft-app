"use strict";

const BigNumber = require('bignumber.js');

//异构网络信息 测试网:test, 主网:main
const HTGNET = 'test';

// NERVE网络信息
const NERVE_INFO = {
    chainId: 5,
    assetId: 1,
    prefix: "TNVT",
    symbol: "TNVT",
    decimals: 8,
    blackHolePublicKey: "000000000000000000000000000000000000000000000000000000000000000000",
    blockHoleAddress: "TNVTdTSPGwjgRMtHqjmg8yKeMLnpBpVN5ZuuY",
    feePubkey: "111111111111111111111111111111111111111111111111111111111111111111"
};

const RPC_URL = {
    BNB: {
        test: "https://data-seed-prebsc-1-s1.binance.org:8545/",
        main: "https://bsc-dataseed.binance.org/"
    },
    HT: {
        test: "https://http-testnet.hecochain.com",
        main: "https://http-mainnet.hecochain.com"
    },
    OKT: {
        test: "https://exchaintestrpc.okex.org",
        main: "https://exchainrpc.okex.org"
    }
};

function Power(arg) {
    let newPower = new BigNumber(10);
    return newPower.pow(arg);
}

function Plus(nu, arg) {
    let newPlus = new BigNumber(nu);
    return newPlus.plus(arg);
}

function Times(nu, arg) {
    let newTimes = new BigNumber(nu);
    return newTimes.times(arg);
}

// function divisionDecimals(nu, decimals = '') {
//     let newDecimals = decimals ? decimals : NERVE_INFO.decimals;
//     if (newDecimals === 0) {
//         return nu
//     }
//     let newNu = new BigNumber(Division(nu, Power(newDecimals)));
//     return newNu.toFormat().replace(/[,]/g, '');
// }

function timesDecimals(nu, decimals) {
    let newDecimals = decimals ? decimals : NERVE_INFO.decimals;
    if (decimals === 0) {
        return nu
    }
    let newNu = 0;
    if(newDecimals > 9 ){
        newNu = new BigNumber(Times(nu, Power(newDecimals))).toFormat().replace(/[,]/g, '');
    }else {
        newNu = new BigNumber(Times(nu, Power(newDecimals))).toString();
    }
    return newNu;
}

function Minus(nu, arg) {
    let newMinus = new BigNumber(nu);
    return newMinus.minus(arg);
}

module.exports = {NERVE_INFO, HTGNET, RPC_URL, Minus, Plus, timesDecimals}
