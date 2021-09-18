/*Tag shows on the left sidebar*/
const net_name = process.env.REACT_APP_ENV_NAME
/*Vol decides the env */
const net_env = process.env.REACT_APP_NET_ENV
/*Mutiple Urls under envs*/
const baseUrl_main = "https://bkapi.dnft.world"
const baseUrl_test = "https://testbkapi.dnft.world"
/*runtime base url*/
const baseUrl = net_env==="mainnet"?baseUrl_main:baseUrl_test

export default {
  net_name,
  // net_env: 'mainnet',
  net_env,
  baseUrl,
  /*java-core-api*/
  backendApi: baseUrl + `/api`,
  /*static-file-data  fixed in main*/
  staticApi: baseUrl_main + `/data/`,
  /*bridge-api  fixed in main*/
  bridgeApi: baseUrl_main + `/bridgeApi`,
  /*faucet-api  fixed in test*/
  faucetApi: baseUrl_test + `/faucet`,
  /*ipfs-api  fixed in main*/
  ipfsUp: `/ipfsApi`,
  /*ipfs-get  fixed in main*/
  ipfsDown: baseUrl_main + `/ipfsGet/`,
}
