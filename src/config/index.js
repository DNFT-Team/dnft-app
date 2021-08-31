const baseUrl = 'https://bkapi.dnft.world'
export default {
  net_env: process.env.REACT_APP_NET_ENV,
  backendApi: `${baseUrl}:8001`,
  staticApi: `${baseUrl}:8965`,
  bridgeApi: `${baseUrl}:8081`,
  ipfsUp: `${baseUrl}:5001`,
  ipfsDown: `${baseUrl}:8080`,
  baseUrl,
}
