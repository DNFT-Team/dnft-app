//  api for trade
import BaseApi from './baseApi'
//  api for query
import chainState from "../store/modules/chainState"
//  util for model
import {stringToHex,hexToString,formatBalance} from '@polkadot/util'

export default class Api {
  /**
   * @description query balance
   * @param address
   */
  static async getBalance(address) {
    let balance = await chainState.state.Api.query['system'].account(address)
    balance = balance.toJSON()
    return formatBalance(balance.data.free)
  }

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
      'nft721Module',
      'createClass',
      callBack,
      stringToHex(form.metaData),//metadata
      form.amount,//amount
      stringToHex(form.data)//data
    )
  }

  /**
   * @description get NFT Category List
   * @constructor
   */
  static async Category_List() {
    let res = []
    let classList = await chainState.state.Api.query['nft721Module'].classList()
    classList = classList.toJSON()|| []
    for(let id of classList){
      let item = await chainState.state.Api.query['nft721Module'].class(id)
      item = item.toJSON() || {}
      res.push({
        classId: id,
        owner:item.owner,
        name: hexToString(item.metadata),
      })
    }
    return res
  }

  /**
   * @description 创建NFT
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
      'nft721Module',
      'mintNft',
      callBack,
      form.categoryHash,
      stringToHex(form.metaData),
      stringToHex(form.data),
      form.price
    )
  }

  /**
   * @description get NFT Item
   * @param nftId
   */
  static async NFT_One(nftId) {
    let res =  await chainState.state.Api.query['nft721Module'].nFTs(nftId)
    res = res.toJSON()
    return {
      tokenId: nftId,
      owner: res.owner,
      price: res.price,
      status: res.status,
      metadata: hexToString(res.metadata),
      data: hexToString(res.data)
    }
  }

  /**
   * @description get Owned List
   * @constructor
   */
  static async NFT_Own_List(address) {
    let PALLET_NAME = 'nft721Module'
    let res = []
    let NftIds = (await chainState.state.Api.query[PALLET_NAME].ownedNFTs(address)).toJSON()
    for (let id of NftIds){
      let nftInfo = (await chainState.state.Api.query[PALLET_NAME].nFTs(id)).toJSON()
      res.push({
        tokenId: id,
        owner: nftInfo.owner,
        price: nftInfo.price,
        status: nftInfo.status,
        metadata: hexToString(nftInfo.metadata),
        data: hexToString(nftInfo.data),
      })
    }
    return res
  }

  /**
   * @description get NFT TaxList
   * @param address
   */
  static async NFT_TaxList(address) {
    let res = []
    let Tax = await chainState.state.Api.query['nft721Module'].dAOTax()
    Tax = formatBalance(Tax||0)
    let nFTInTax = await chainState.state.Api.query['nft721Module'].nFTInTax(address)
    for(let nftId of nFTInTax){
      let nftInfo = (await chainState.state.Api.query['nft721Module'].nFTs(nftId)).toJSON()
      res.push({
        tokenId: nftId,
        price: nftInfo.price,
        status: nftInfo.status,
        tax: Tax,
        metadata: hexToString(nftInfo.metadata),
        data: hexToString(nftInfo.data),
      })
    }
    return res
  }

  /**
   * @description get NFT List
   * @constructor
   */
  static async NFT_List() {
    const PALLET_NAME = 'nft721Module'
    let res = []

    let counter = (await chainState.state.Api.query[PALLET_NAME].nFTsCount()).toNumber()
    for (let i = 0;i<counter;i++){
      let nftId = (await chainState.state.Api.query[PALLET_NAME].nFTsIndex(i)).toJSON()
      let nftInfo = (await chainState.state.Api.query[PALLET_NAME].nFTs(nftId)).toJSON()
      res.push({
        tokenId: nftId,
        owner: nftInfo.owner,
        price: nftInfo.price,
        status: nftInfo.status,
        metadata: hexToString(nftInfo.metadata),
        data: hexToString(nftInfo.data),
      })
    }
    // console.log(res);
    return res
  }

  /**
   * @description 出售NFT-market可见
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
      'nft721Module',
      'offerNft',
      callBack,
      form.hash, // nft id
      form.price // new price
    )
  }
  /**
   * @description  交易中心购买NFT
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
      'nft721Module',
      'buyNft',
      callBack,
      nft_id
    )
  }

  /**
   * @description 单个nft结帨
   * @param nft_id
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_PayTaxOne(
    nft_id,
    callBack
  ){
    return BaseApi.signAndSend(
      'nft721Module',
      'buyNft',
      callBack,
      nft_id
    )
  }
  /**
   * @description 全部nft结帨
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_PayTaxAll(
    callBack
  ){
    return BaseApi.signAndSend(
      'nft721Module',
      'payTotalTax',
      callBack
    )
  }

  /**
   * @description 创建DAO
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static DAO_Add(
    form,
    callBack
  ){
    return BaseApi.signAndSend(
      'daoModule',
      'createProposal',
      callBack,
      stringToHex(form.name),
      stringToHex(form.content),
      form.min_to_succeed,
      Math.ceil(new Date(form.ddl).getTime()/1000)
    )
  }

  /**
   * @description DAO 投票
   * @param ProposalId
   * @param flag
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static DAO_Vote(
    ProposalId,
    flag,
    callBack
  ){
    return BaseApi.signAndSend(
      'daoModule',
      'vote',
      callBack,
      ProposalId,
      !!flag
    )
  }

  /**
   * @description check vote for proposal
   * @param proposalId
   * @param accountId
   * @returns {Promise<void>}
   */
  static async DAO_Vote_Check(proposalId,accountId){
    return  ( await chainState.state.Api.query['daoModule'].memberProposals(proposalId,accountId) ).toJSON()
  }

  /**
   * @description DAO List
   */
  static async DAO_List(){
    const counter = (await chainState.state.Api.query['daoModule'].proposalsCount()).toNumber()
    let res = []
    for (let i = 0;i<counter;i++){
      let proposalId = (await chainState.state.Api.query['daoModule'].proposalsIndex(i)).toJSON()
      let _temp = await chainState.state.Api.query['daoModule'].proposals(proposalId)
      _temp = _temp.toJSON()
      let {deadline,vote_yes,vote_no,min_to_succeed} = _temp
      let rYes = 100 * vote_yes/(vote_yes+vote_no)
      let rNo = 100 * vote_no/(vote_yes+vote_no)
      let rProcess = 100 * vote_yes/min_to_succeed
      deadline = new Date(deadline*1000)
      res.push({
        proposalId ,
        owner: _temp.owner,
        name: hexToString(_temp.name),
        content: hexToString(_temp.content),
        ddl: deadline.toISOString(),
        min_to_succeed: _temp.min_to_succeed,
        vote_no: _temp.vote_no,
        vote_yes: _temp.vote_yes,
        ratioYes:rYes||0,
        ratioNo:rNo||0,
        ratioProcess:rProcess||0
      })
    }
    return res
  }
}
