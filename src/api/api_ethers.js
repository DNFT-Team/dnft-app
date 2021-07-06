const ethers = require('ethers')
const {RPC_URL} = require('../config/htgConfig');
const apiEther = {
    /**
     *获取provider
     * @param chain
     * @param isMetaMask
     */
    getProvider(chain, HTGNET) {
        if (chain === 'ETH') {
            //异构网络信息 测试网:ropsten, 主网:homestead
            if (HTGNET === 'test') {
                HTGNET = 'ropsten';
            } else if (HTGNET === 'main') {
                HTGNET = 'homestead';
            }
            return ethers.getDefaultProvider(HTGNET);
        } else {
            return new ethers.providers.JsonRpcProvider(RPC_URL[chain][HTGNET]);
        }
    },
    /**
     * 提现默认手续费--nvt
     * @param provider
     * @param nvtUSD    nvt的USDT价格
     * @param heterogeneousChainUSD    异构链币种的USDT价格
     * @param isToken   是否token资产
     */
    async calNVTOfWithdrawTest(provider, nvtUSD, heterogeneousChainUSD, isToken) {
        const gasPrice = await this.getWithdrawGas(provider);
        const result = this.calNVTOfWithdraw(nvtUSD, gasPrice, heterogeneousChainUSD, isToken);
        return result
    },

    async getWithdrawGas(provider) {
        return provider.getGasPrice().then((gasPrice) => {
            return gasPrice;
        });
    },

    /**
     * @param nvtUSD    nvt的USDT价格
     * @param gasPrice  当前异构网络的平均gas价格
     * @param heterogeneousChainUSD    异构链币种的USDT价格
     * @param isToken   是否token资产
     */
    calNVTOfWithdraw(nvtUSD, gasPrice, heterogeneousChainUSD, isToken) {
        /*console.log('nvtUSD', nvtUSD)
        console.log('gasPrice', gasPrice.toString())
        console.log('ethUSD', ethUSD)*/
        let gasLimit;
        if (isToken) {
            gasLimit = new ethers.utils.BigNumber('210000');
        } else {
            gasLimit = new ethers.utils.BigNumber('190000');
        }
        const nvtUSDBig = ethers.utils.parseUnits(nvtUSD.toString(), 6);
        const ethUSDBig = ethers.utils.parseUnits(heterogeneousChainUSD.toString(), 6);
        const result = ethUSDBig.mul(gasPrice).mul(gasLimit).div(ethers.utils.parseUnits(nvtUSDBig.toString(), 10));
        // console.log('result: ' + result.toString());
        const numberStr = ethers.utils.formatUnits(result, 8).toString();
        const ceil = Math.ceil(numberStr);
        // console.log('ceil: ' + ceil);
        const finalResult = ethers.utils.parseUnits(ceil.toString(), 8);
        // console.log('finalResult: ' + finalResult);
        return finalResult;
    },
    formatNVT(amount) {
        return ethers.utils.formatUnits(amount, 8).toString();
    }
}
export default apiEther