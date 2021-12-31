import { isAddress } from 'web3-utils';

export const getObjectURL = (file) => {
  let url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}
export function shortenString (str) {
  return !str ? '' : str.length <= 11 ? str : str.substring(0, 6) + '...' + str.substring(str.length - 4)
}
export function shortenAddress (address, chars = 6) {
  const parsed = isAddress(address);
  if(!parsed) {
    console.error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${address?.substring(0, chars + 1)}...${address?.substring(42 - chars)}`
}