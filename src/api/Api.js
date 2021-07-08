//  api for trade
import { stringToHex, hexToString, formatBalance } from '@polkadot/util';
import BaseApi from './baseApi';
//  api for query
import chainState from '../store/modules/chainState';
//  util for model

export default class Api {
  /**
   * @description query balance
   * @param address
   */
  static async getBalance(address) {
    let balance = await chainState.state.Api.query.system.account(address);
    balance = balance.toJSON();
    return formatBalance(balance.data.free);
  }

  /**
   * @description add NFT Category
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static Category_Add(form, callBack) {
    return BaseApi.signAndSend(
      'nft721Module',
      'createClass',
      callBack,
      stringToHex(form.metaData), // metadata
      stringToHex(form.data), // data
      form.amount, // amount
    );
  }

  /**
   * @description get NFT Category List
   * @constructor
   */
  static async Category_List() {
    const counter = (await chainState.state.Api.query.nft721Module.classCount()).toNumber();
    const res = [];
    for (let i = 0; i < counter; i++) {
      try {
        const classId = (await chainState.state.Api.query.nft721Module.classIndex(i)).toJSON();
        let _temp = await chainState.state.Api.query.nft721Module.classInfos(classId);
        _temp = _temp.toJSON();
        res.push({
          classId,
          owner: _temp.issuer,
          name: hexToString(_temp.name),
        });
      } catch (err) {
        console.log(err);
      }
    }
    console.log(res);
    return res;
  }

  /**
   * @description 创建NFT
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Add(form, callBack) {
    return BaseApi.signAndSend(
      'nft721Module',
      'mintNft',
      callBack,
      form.categoryHash,
      stringToHex(form.metaData),
      stringToHex(form.data),
      form.price,
    );
  }

  /**
   * @description get NFT Item
   * @param nftId
   */
  static async NFT_One(nftId) {
    let res = await chainState.state.Api.query.nft721Module.nFTInfos(nftId);
    res = res.toJSON();
    return {
      tokenId: nftId,
      owner: res.issuer,
      price: res.price,
      status: res.status,
      metadata: hexToString(res.info),
      data: hexToString(res.metadata),
    };
  }

  /**
   * @description get NFT List with class
   * @constructor
   */
  static async NFT_Class_List(classId) {
    const PALLET_NAME = 'nft721Module';
    const res = [];
    const counter = (await chainState.state.Api.query[PALLET_NAME].classMintIndex(classId)).toNumber();

    for (let i = 0; i < counter; i++) {
      try {
        const nftId = (await chainState.state.Api.query[PALLET_NAME].nFTByClassIndex(classId, i + 1)).toJSON();
        let _temp = await chainState.state.Api.query[PALLET_NAME].nFTInfos(nftId);
        _temp = _temp.toJSON();
        res.push({
          tokenId: nftId,
          owner: _temp.issuer,
          price: _temp.price,
          status: _temp.status,
          metadata: hexToString(_temp.info),
          data: hexToString(_temp.metadata),
        });
      } catch (err) {
        console.log(err);
      }
    }
    return res;
  }

  /**
   * @description get NFT TaxList
   * @param address
   */
  static async NFT_TaxList(address) {
    const res = [];
    let Tax = await chainState.state.Api.query.nft721Module.dAOTax();
    Tax = formatBalance(Tax || 0);
    const nFTInTax = await chainState.state.Api.query.nft721Module.nFTInTax(address);
    for (const nftId of nFTInTax) {
      const nftInfo = (await chainState.state.Api.query.nft721Module.nFTInfos(nftId)).toJSON();
      res.push({
        tokenId: nftId,
        price: nftInfo.price,
        status: nftInfo.status,
        tax: Tax,
        metadata: hexToString(nftInfo.info),
        data: hexToString(nftInfo.metadata),
      });
    }
    return res;
  }

  /**
   * @description get NFT List
   * @constructor
   */
  static async NFT_List(address = '') {
    const PALLET_NAME = 'nft721Module';
    const res = [];

    const counter = (await chainState.state.Api.query[PALLET_NAME].nFTsCount()).toNumber();
    for (let i = 0; i < counter; i++) {
      const nftId = (await chainState.state.Api.query[PALLET_NAME].nFTsIndex(i)).toJSON();
      const nftInfo = (await chainState.state.Api.query[PALLET_NAME].nFTInfos(nftId)).toJSON();
      res.push({
        tokenId: nftId,
        owner: nftInfo.issuer,
        price: nftInfo.price,
        status: nftInfo.status,
        metadata: hexToString(nftInfo.info),
        data: hexToString(nftInfo.metadata),
      });
    }
    // console.log(res);
    return address ? res.filter((e) => e.owner === address) : res;
  }

  /**
   * @description 出售NFT-market可见
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Offer(form, callBack) {
    return BaseApi.signAndSend(
      'nft721Module',
      'offerNft',
      callBack,
      form.hash, // nft id
      form.price, // new price
    );
  }

  /**
   * @description  交易中心购买NFT
   * @param nft_id
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_Buy(nft_id, callBack) {
    return BaseApi.signAndSend('nft721Module', 'buyNft', callBack, nft_id);
  }

  /**
   * @description 单个nft结帨
   * @param nft_id
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_PayTaxOne(nft_id, callBack) {
    return BaseApi.signAndSend('nft721Module', 'buyNft', callBack, nft_id);
  }

  /**
   * @description 全部nft结帨
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static NFT_PayTaxAll(callBack) {
    return BaseApi.signAndSend('nft721Module', 'payTotalTax', callBack);
  }

  /**
   * @description 创建DAO
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static DAO_Add(form, callBack) {
    return BaseApi.signAndSend(
      'daoModule',
      'createProposal',
      callBack,
      'ChangeDAOTax',
      form.number,
      stringToHex(form.content),
      form.money,
      form.min_to_succeed,
      Math.ceil(new Date(form.ddl).getTime() / 1000),
    );
  }

  /**
   * @description DAO 投票
   * @param ProposalId
   * @param flag
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static DAO_Vote(ProposalId, flag, callBack) {
    return BaseApi.signAndSend('daoModule', 'vote', callBack, ProposalId, !!flag);
  }

  /**
   * @description check vote for proposal
   * @param proposalId
   * @param accountId
   * @returns {Promise<void>}
   */
  static async DAO_Vote_Check(proposalId, accountId) {
    return (
      await chainState.state.Api.query.daoModule.memberProposals(proposalId, accountId)
    ).toJSON();
  }

  /**
   * @description DAO List
   */
  static async DAO_List() {
    const counter = (await chainState.state.Api.query.daoModule.proposalsCount()).toNumber();
    const res = [];
    for (let i = 0; i < counter; i++) {
      const proposalId = (await chainState.state.Api.query.daoModule.proposalsIndex(i)).toJSON();
      let _temp = await chainState.state.Api.query.daoModule.proposals(proposalId);
      _temp = _temp.toJSON();
      let {
        deadline, vote_yes, vote_no, min_to_succeed,
      } = _temp;
      const rYes = (100 * vote_yes) / (vote_yes + vote_no);
      const rNo = (100 * vote_no) / (vote_yes + vote_no);
      const rProcess = (100 * vote_yes) / min_to_succeed;
      deadline = new Date(deadline * 1000);
      res.push({
        proposalId,
        owner: _temp.owner,
        money: _temp.value_money,
        number: _temp.value_number,
        content: hexToString(_temp.value_string),
        ddl: deadline.toISOString(),
        min_to_succeed: _temp.min_to_succeed,
        vote_no: _temp.vote_no,
        vote_yes: _temp.vote_yes,
        ratioYes: rYes || 0,
        ratioNo: rNo || 0,
        ratioProcess: rProcess || 0,
      });
    }
    return res;
  }

  /**
   * @description 创建Ai.data
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static aiAddData(form, callBack) {
    return BaseApi.signAndSend(
      'aiModule',
      'createAiData',
      callBack,
      form.industry,
      form.technology,
      form.resource,
      Math.ceil(new Date().getTime() / 1000),
    );
  }

  /**
   * @description 创建Ai.model
   * @param form
   * @param callBack
   * @returns {Promise<void>}
   * @constructor
   */
  static aiAddModel(form, callBack) {
    return BaseApi.signAndSend(
      'aiModule',
      'createAiModel',
      callBack,
      stringToHex(form.title),
      form.language,
      stringToHex(form.framwork),
      Math.ceil(new Date().getTime() / 1000),
      [],
    );
  }

  static aiModelBoundNft(form, callBack) {
    return BaseApi.signAndSend(
      'aiModule',
      'boundAiModelWithNft',
      callBack,
      form.ai_model_id,
      form.class_id,
      form.info,
      form.metadata,
      form.price,
    );
  }

  static aiDataBoundNft(form, callBack) {
    return BaseApi.signAndSend(
      'aiModule',
      'boundAiDataWithNft',
      callBack,
      form.ai_data_id,
      form.class_id,
      form.info,
      form.metadata,
      form.price,
    );
  }

  static aiDataBoundCollection(form, callBack) {
    return BaseApi.signAndSend(
      'aiModule',
      'boundAiDataWithCollection',
      callBack,
      form.ai_data_id,
      form.collection_id,
    );
  }

  static async getAiDataList() {
    const counter = (await chainState.state.Api.query.aiModule.aIDataCount()).toNumber();
    const res = [];
    for (let i = 0; i < counter; i++) {
      try {
        const proposalId = (await chainState.state.Api.query.aiModule.aIDataIndex(i)).toJSON();
        let _temp = await chainState.state.Api.query.aiModule.aIDatas(proposalId);
        _temp = _temp.toJSON();
        res.push(_temp);
      } catch (err) {
        console.log(err);
      }
    }
    return res;
  }

  static async getAiModelList() {
    const counter = (await chainState.state.Api.query.aiModule.aIModelCount()).toNumber();
    const res = [];
    for (let i = 0; i < counter; i++) {
      try {
        const proposalId = (await chainState.state.Api.query.aiModule.aIModelIndex(i)).toJSON();
        let _temp = await chainState.state.Api.query.aiModule.aIModels(proposalId);
        _temp = _temp.toJSON();
        res.push({
          ..._temp,
          title: hexToString(_temp.title),
          framwork: hexToString(_temp.framwork),
        });
      } catch (err) {
        console.log(err);
      }
    }
    return res;
  }
}
