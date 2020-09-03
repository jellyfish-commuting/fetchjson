// Debug
/* eslint-disable object-curly-newline */
function debug({ method, url, params, status, payload }) {
  if (process.env.NODE_ENV !== 'production') {
    console.groupCollapsed('API debug');
    console.log('%c URL : ', 'color: #912599', `${method} ${url}`);
    console.log('%c Params : ', 'color: #912599', params);
    console.log('%c Status : ', 'color: #912599', status);
    console.log('%c Response : ', 'color: #912599', payload);
    console.groupEnd('API debug');
  }
}
/* eslint-enable object-curly-newline */

// Callback
let fetchingStart = () => null;
let fetchingEnd = () => null;
let fetchingSuccess = () => null;
let fetchingError = () => null;

export function onFetchingStart(callback) {
  fetchingStart = callback;
}

export function onFetchingEnd(callback) {
  fetchingEnd = callback;
}

export function onFetchingSuccess(callback) {
  fetchingSuccess = callback;
}

export function onFetchingError(callback) {
  fetchingError = callback;
}

// Create native fetch
export default (pmethod, pendpoint, pdata = null, pheaders = {}) => {
  // Apply callback
  const {
    method = pmethod,
    endpoint = pendpoint,
    data = pdata,
    headers = pheaders,
  } = fetchingStart({ method: pmethod, endpoint: pendpoint, data: pdata, headers: pheaders }) || {};

  // Init
  const params = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Init url
  let url = endpoint;

  // Data ?
  if (data) {
    // Query params ?
    if (params.method === 'GET' || params.method === 'HEAD') {
      // Convert object data to query string ie { q: 'lorem', z: 'boom', ... } to q=lorem&z=boom
      url += '?';
      url += Object.keys(data).reduce((acc, key) => {
        if (Array.isArray(data[key])) {
          return acc.concat(data[key].map(item => `${key}[]=${item}`).join('&'));
        }

        return acc.concat(`${key}=${data[key]}`);
      }, []).join('&');

    // ... body params
    } else {
      // Stringify data
      params.body = JSON.stringify(data);
    }
  }

  // Return native fetch Request
  /* eslint-disable object-curly-newline */
  return fetch(url, params)

    // Get response
    .then(response => response.json().then(payload => {
      // Log
      debug({ method, url, params, payload, status: response.status });

      // Error ?
      if (!response.ok) {
        const error = new Error(payload.message);
        error.status = response.status;

        // Error callback
        fetchingError(error);

        throw error;
      }

      // Success callback
      fetchingSuccess(response);

      return payload;
    }))

    // End fetching ...
    .finally(fetchingEnd);
  /* eslint-enable object-curly-newline */
};
