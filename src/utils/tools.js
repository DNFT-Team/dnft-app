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
