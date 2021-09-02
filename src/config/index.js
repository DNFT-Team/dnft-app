const baseUrl = 'https://bkapi.dnft.world'
export default {
  net_env: process.env.REACT_APP_NET_ENV,
  baseUrl,
  /*java-core-api*/
  backendApi: baseUrl + `/api`,
  /*static-file-data*/
  staticApi: baseUrl + `/data/`,
  /*bridge-api*/
  bridgeApi: baseUrl + `/bridgeApi`,
  /*ipfs-api*/
  ipfsUp: baseUrl + `/ipfsApi`,
  /*ipfs-get*/
  ipfsDown: baseUrl + `/ipfsGet/`,
}
