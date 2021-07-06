import Web3 from "web3";

// basic
export const WEB3_MAX_NUM = Web3.utils.toBN('115792089237316195423570985008687907853269984665640564039457584007913129639935')

export const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

/**
 * @description wei-unit 互相转换
 * @param num{number|string}
 * @param dir{boolean}
 * @param unit{['noether','wei','kwei','ether']|*}
 * @param isBN{boolean}
 * @returns {any|number}
 */
export const toDecimal = (
    num= 0,
    dir= false,
    unit = 'ether',
    isBN= false
)=>{
    if(!num) return 0
    let n = dir ? Web3.utils.toWei( num, unit) :  Web3.utils.fromWei( num.toString(), unit)
    return isBN? Web3.utils.toBN(n) : n
}
