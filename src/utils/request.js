export const URL_CLOUD = 'http://api.nftable.org';

let BASE_URL = URL_CLOUD;

const FETCH_TIMEOUT = 15 * 1000
let _token = ''

export function setTokenForReq (token) {
  _token = token
}

export default function request (url, options) {
  if (BASE_URL.length == 0) {return;}
  const defaultOptions = { headers: {} }
  const newOptions = { ...defaultOptions, ...options }
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        // Authorization: _token,
        ...newOptions.headers,
      }
      newOptions.body = JSON.stringify(newOptions.body)
    } else { // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        // Authorization: _token,
        ...newOptions.headers,
      }
    }
  } else {
    newOptions.headers = {
      // Authorization: _token,
      ...newOptions.headers,
    }
  }

  let URL = URL_CLOUD + url

  const req = Promise.race([
    fetch(URL, newOptions),
    new Promise((resolve, reject) => {
      setTimeout(
        () =>
          reject(
            new RequestError({
              message: 'request time out',
              code: '408',
            })
          ),
        FETCH_TIMEOUT
      )
    }),
  ])

  return req
    .then(checkCode)
    .then((response) => {

      const statusCode = response.status;
      const data = response.json();
      return Promise.all([{ status: statusCode }, data]);
    })
    .then((text) => {
      console.log('RESP:', text)
      return { ...text[0], data: text[1] }
    })
    .catch((e) => {
      if (process.env.NODE_ENV !== 'production') {
        console.groupCollapsed(
          `%c RESP error :${BASE_URL + url}`,
          'background:black;color:red'
        )
        console.warn(e)
        console.groupEnd(`RESP error:${url}`)
      }
    })
}

export const get = (url, params) => request(
  `${url}?${stringify({ ...params })}`,
  {
    method: 'GET',
  })

export const put = (url, params) => request(url, {
  method: 'PUT',
  body: params,
})

export const post = (url, params) => request(url, {
  method: 'POST',
  body: params,
})

export const _delete = (url, params) => request(
  `${url}?${stringify({ ...params })}`,
  {
    method: 'DELETE',
  })

function stringify (params) {
  let tempParams = [];
  Object.keys(params).forEach((key) => {
    let value = params[key];
    if (value === '' || value === null || value === undefined) {return;}
    tempParams.push([key, encodeURIComponent(value)].join('='));
  });
  return tempParams.join('&');
}

function checkCode (res) {
  return res
}


class RequestError extends Error {
  constructor (props) {
    super(props)
    this.success = false
    this.message = props.message
    this.code = props.code
  }
}

