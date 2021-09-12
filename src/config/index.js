const baseUrl = 'https://bkapi.dnft.world'
export default {
  net_env: process.env.REACT_APP_NET_ENV,
  // net_env: 'mainnet',
  baseUrl,
  /*java-core-api*/
  backendApi: baseUrl + `/api`,
  /*static-file-data*/
  staticApi: baseUrl + `/data/`,
  /*bridge-api*/
  bridgeApi: baseUrl + `/bridgeApi`,
  /*faucet-api*/
  faucetApi: baseUrl + `/faucet`,
  /*ipfs-api*/
  ipfsUp: `/ipfsApi`,
  /*ipfs-get*/
  ipfsDown: baseUrl + `/ipfsGet/`,
}
