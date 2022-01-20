export default () => {
	const browser = {
		versions: (function () {
			let u = navigator.userAgent,
				app = navigator.appVersion
			return {
				trident: u.indexOf('Trident') > -1, // IE

				presto: u.indexOf('Presto') > -1, // opera

				webKit: u.indexOf('AppleWebKit') > -1, // ios/google

				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // firfox

				mobile: !!u.match(/AppleWebKit.*Mobile.*/), // mobile

				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios

				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android/uc

				iPhone: u.indexOf('iPhone') > -1, // iphone/qqHD

				iPad: u.indexOf('iPad') > -1, // iPad

				webApp: u.indexOf('Safari') == -1, // webapp,headless
			}
		})(),
	}
	return (
		browser.versions.mobile ||
		browser.versions.ios ||
		browser.versions.android ||
		browser.versions.iPhone ||
		browser.versions.iPad
	)
}
