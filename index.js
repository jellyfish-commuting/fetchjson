import _queryString from '@jellyfish-commuting/helpers/_queryString';

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

// Create native fetch
export default (endpoint, { method = 'GET', headers: {}, data }) => {
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
      url += `?${_queryString(data)}`;

    // Stringify data
    } else {
      params.body = JSON.stringify(data);
    }
  }

  // Return native fetch
  return fetch(url, params)
    // Get response
    .then(response => response.json().then(payload => {
      // Log
      debug({ method, url, params, payload, status: response.status });

      // Error ?
      if (!response.ok) {
        const error = new Error(payload.message);
        error.status = response.status;

        throw error;
      }

      return payload;
    }));
};
