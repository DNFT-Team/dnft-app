export const getWallet = () => {
  if (window.ethereum?.selectedAddress) {
    return window.ethereum;
  }
  if (window.walletProvider?.connected) {
    return window.walletProvider;
  }
  if (window.onto?.selectedAddress) {
    return window.onto;
  }
  if (window.ethereum?.isONTO) {
    return window.ethereum
  }
}