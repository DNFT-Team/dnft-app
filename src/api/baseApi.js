import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from '@polkadot/extension-dapp'
import chainState from "../store/modules/chainState"

export default class BaseApi {
  /**
   * @description api for trade with sign
   * @param pallets
   * @param module
   * @param _callBack
   * @param args
   * @returns {Promise<void>}
   */
  static async signAndSend(
    pallets,
    module,
    _callBack,
    ...args
  ) {
    console.log('#super.signAndSend', args)
    let api = chainState.state.Api
    const allInjected = await web3Enable('NFT')
    const allAccounts = await web3Accounts()

    // // returns an array of { address, meta: { name, source } }
    // // meta.source contains the name of the extension that provides this account

    // // finds an injector for an address
    let accountIndex = Number(localStorage.getItem('accountIndex')||0)
    const sender = allAccounts[accountIndex].address

    const injector = await web3FromAddress(sender)

    // // sets the signer for the address on the @polkadot/api. The alternative approach it to pass the signer through
    // // options to signAndSend in the next step where we are sending (and skip this injection here), e.g
    // // `.signAndSend(<address>, { signer: injector.signer }, (status) => { ... })`
    api.setSigner(injector.signer)
    // const tx = api.tx.balances.transfer(
    const tx = api.tx[pallets][module](...args)
    // // sign and send our transaction - notice here that the address of the account (as retrieved injected)
    // // is passed through as the param to the `signAndSend`, the API then calls the extension to present
    // // to the user and get it signed. Once complete, the api sends the tx + signature via the normal process
    const unsub = await tx.signAndSend(
      sender,
      (
        result,
        _t
      ) => {
        if (result.status.isFinalized || result.status.isInBlock) {
          let hash = ''
          if (result.status.isInBlock) {
            // console.log(
            //     `Transaction included at blockHash ${result.status.asInBlock}`
            // )
            hash = result.status.asInBlock
          } else if (result.status.isFinalized) {
            // console.log(
            //     `Transaction finalized at blockHash ${result.status.asFinalized}`
            // )
            hash = result.status.asFinalized
            unsub()
          }
          result.events
            .filter(
              ({event: {section}}) => section === 'system'
            )
            .forEach((ele) => {
              let {data, method} = ele.event
              if (method === 'ExtrinsicFailed') {
                const [dispatchError] = data
                if (dispatchError.isModule) {
                  try {
                    const mod = dispatchError.asModule
                    const error = data.registry.findMetaError(
                      new Uint8Array([
                        mod.index.toNumber(),
                        mod.error.toNumber()
                      ])
                    )
                    console.log('错误提示:', error.name) //错误提示
                    return _callBack({
                      code: -1,
                      msg: error.name,
                      hash: hash.toString(),
                      result: null
                    })
                  } catch (error) {
                    console.log(error)
                    return _callBack({
                      code: -2,
                      msg: error.name,
                      hash: hash.toString(),
                      result: null
                    })
                  }
                }
              } else if (method === 'ExtrinsicSuccess') {
                console.log(
                  '成功',
                  hash.toString(),
                  result.status.isInBlock,
                  result.status.isFinalized
                )
                if(result.status.isInBlock){
                  return _callBack({
                    code: 0,
                    msg: 'ExtrinsicSuccess',
                    hash: hash.toString(),
                    result: {
                      isInBlock: result.status.isInBlock,
                      isFinalized: result.status.isFinalized
                    }
                  })
                }
              }
            })
        } else if (result.isError) {
          console.log('fail2,', result.toHuman())
          return _callBack({
            code: -99,
            msg: 'Error',
            hash: '',
            result: null
          })
        }
      }
    )
  } //end signAndSend
}
