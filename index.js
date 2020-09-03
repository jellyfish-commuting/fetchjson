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
let fetchingWillStart = () => null;
let fetchingComplete = () => null;
let fetchingSuccess = () => null;
let fetchingError = () => null;

export const onFetchingWillStart = callback => fetchingWillStart = callback;
export const onFetchingComplete = callback => fetchingComplete = callback;
export const onFetchingSuccess = callback => fetchingSuccess = callback;
export const onFetchingError = callback => fetchingError = callback;

// Create native fetch
export default (method, endpoint, data = null, headers = {}) => {
  // Merge params with callback results
  const mutated = {
    method,
    endpoint,
    data,
    headers,
    ...fetchingWillStart({ method, endpoint, data, headers }) || {},
  };

  // Init
  const params = {
    method: mutated.method,
    headers: {
      'Content-Type': 'application/json',
      ...mutated.headers,
    },
  };

  // Init url
  let url = mutated.endpoint;

  // Data ?
  if (mutated.data) {
    // Query params ?
    if (params.method === 'GET' || params.method === 'HEAD') {
      // Convert object data to query string ie { q: 'lorem', z: 'boom', ... } to q=lorem&z=boom
      url += '?';
      url += Object.keys(mutated.data).reduce((acc, key) => {
        if (Array.isArray(mutated.data[key])) {
          return acc.concat(mutated.data[key].map(item => `${key}[]=${item}`).join('&'));
        }

        return acc.concat(`${key}=${mutated.data[key]}`);
      }, []).join('&');

    // ... body params
    } else {
      // Stringify data
      params.body = JSON.stringify(mutated.data);
    }
  }

  // Return native fetch Request
  /* eslint-disable object-curly-newline */
  return fetch(url, params)

    // Get response in JSON
    .then(response => response.json()
      .then(payload => {
        // Log
        debug({ method, url, params, payload, status: response.status });

        // Error ?
        if (!response.ok) {
          const error = new Error(payload.message);
          error.status = response.status;

          throw error;
        }

        // Success callback
        fetchingSuccess(response);

        return payload;
      })
      .catch(error => {
        error.status = response.status;
        throw error;
      }))

    // Error
    .catch(error => {
      // Log
      debug({ method, url, params, payload: error, status: error.status });

      // Error callback
      fetchingError(error);

      throw error;
    })

    // End fetching ...
    .finally(fetchingComplete);
  /* eslint-enable object-curly-newline */
};
