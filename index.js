const { _queryString } = require('@jellyfish-commuting/helpers');

// Debug
/* eslint-disable object-curly-newline */
function debug({ url, params, status, payload }) {
  if (process.env.NODE_ENV !== 'production') {
    console.groupCollapsed('API debug');
    console.log('%c URL : ', 'color: #912599', `${params.method || 'GET'} ${url}`);
    console.log('%c Params : ', 'color: #912599', params);
    console.log('%c Status : ', 'color: #912599', status);
    console.log('%c Response : ', 'color: #912599', payload);
    console.groupEnd('API debug');
  }
}
/* eslint-enable object-curly-newline */

// Create native fetch
module.exports = function (endpoint, {
  onStart = () => null,
  onResponse = () => null,
  onComplete = () => null,
  onError = () => null,
  data,
  ...init
}) {
  // Init params
  const params = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  };

  // Init url
  let url = endpoint;

  // Data ?
  if (data) {
    // Query params ?
    if (!params.method || params.method === 'GET' || params.method === 'HEAD') {
      url += `?${_queryString(data)}`;

    // Stringify data
    } else {
      params.body = JSON.stringify(data);
    }
  }

  // Hook onStart
  onStart(url, params);

  // Return native fetch
  return fetch(url, params)
    // Get response
    .then(response => {
      // Hook onResponse
      onResponse(response);

      // Return response in JSON
      return response.json().then(payload => {
        // Log
        debug({ url, params, payload, status: response.status });

        // Error ?
        if (!response.ok) {
          const error = new Error(payload.message);
          error.status = response.status;

          throw error;
        }

        return payload;
      });
    })
    // Hook onError
    .catch(error => {
      onError(error);
      throw error;
    })
    // Hook onComplete
    .finally(onComplete);
};
