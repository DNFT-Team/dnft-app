export const getWallet = () => {
	if (
		window.ethereum?.selectedAddress ||
		window.ethereum?.isConnected()
	) {
		return window.ethereum
	}
	if (window.walletProvider?.connected) {
		return window.walletProvider
	}
	if (
		window.onto?.selectedAddress ||
		window.onto?.isConnected()
	) {
		return window.onto
	}
	if (window.ethereum?.isONTO) {
		return window.ethereum
	}
}
