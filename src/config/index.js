const baseUrl = 'https://bkapi.dnft.world'
export default {
  net_env: process.env.REACT_APP_NET_ENV,
  backendApi: `${'http://92.205.29.153'}:8001`,
  staticApi: `${baseUrl}:8965`,
  bridgeApi: `${baseUrl}:8081`,
  ipfsUp: `${'baseUrl'}:5001`,
  ipfsDown: `${'http://92.205.29.153'}:8080`,
  baseUrl,
}
