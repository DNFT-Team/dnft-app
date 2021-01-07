//  api for trade
import BaseApi from './baseApi'
//  api for query
import chainState from "../store/modules/chainState"
//  util for model
import {stringToHex,hexToString} from '@polkadot/util'

const PALLET_NAME = 'nftModule'

export default class Nft {
  /**
   * @description add NFT Category
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static Category_Add(
    form,
    callBack
  ) {
    return BaseApi.signAndSend(
      PALLET_NAME,
      'createClass',
      callBack,
      stringToHex(form.originData),
      form.totalSupply,
      stringToHex(form.desc)
    )
  }

  /**
   * @description get NFT Category IdList
   * @returns {Promise<void>}
   * @constructor
   */
  static async Category_IdList() {
    let res = await chainState.state.Api.query[PALLET_NAME].classList()
    res = res.toJSON()
    return res
  }


  /**
   * @description get NFT IdList
   * @returns {Promise<void>}
   * @constructor
   */
  static async NFT_IdList() {
    let res = []

    let counter = (await chainState.state.Api.query[PALLET_NAME].nFTsCount()).toNumber()
    for (let i = 0;i<counter;i++){
      let nftIndex = (await chainState.state.Api.query[PALLET_NAME].nFTsIndex(i)).toJSON()
      let nftInfo = (await chainState.state.Api.query[PALLET_NAME].nFTs(nftIndex)).toJSON()
      res.push({
        name: 'Buy Blah NowMrBlah',
        icon: 'https://www.mybae.io/uploads/e34bc9bb-859c-449c-86ec-27af62bbc45a.gif',
        metaData:hexToString(nftInfo.metadata),
        status: nftInfo.status,
        desc: hexToString(nftInfo.data),
        price: nftInfo.price,
        tokenId: nftIndex,
      })
    }

    console.log('#NFT-List',res)

    return res
  }

  /**
   * @description 1）创建NFT
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Add(
    form,
    callBack
  ){
    return BaseApi.signAndSend(
      PALLET_NAME,
      'mintNft',
      callBack,
      form.categoryHash,
      stringToHex(form.metaData),
      stringToHex(form.desc),
      form.price
    )
  }

  /**
   * @description 2）出售NFT
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Offer(
    form,
    callBack
  ){
    return BaseApi.signAndSend(
      PALLET_NAME,
      'offerNft',
      callBack,
      form.nft_id,
      form.price
    )
  }
  /**
   * @description   1）交易中心购买NFT
   * @param nft_id
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Buy(
    nft_id,
    callBack
  ){
    return BaseApi.signAndSend(
      PALLET_NAME,
      'buyNft',
      callBack,
      nft_id
    )
  }
  /**
   * @description   2）交税
   * @param nft_id
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Tax(
    nft_id,
    callBack
  ){
    return BaseApi.signAndSend(
      PALLET_NAME,
      'payTax',
      callBack,
      nft_id
    )
  }

  /**
   * @description get NFT TaxList
   * @returns {Promise<void>}
   * @constructor
   */
  static async NFT_TaxList() {
    let account = await chainState.state.Api.query[PALLET_NAME].dAOAcc()
    let res = await chainState.state.Api.query[PALLET_NAME].dAOTax()
    return res.toJSON()
  }
}
