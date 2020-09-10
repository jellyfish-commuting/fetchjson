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
module.exports = function (endpoint, data, options = {}) {
  // Init params
  const { _response = () => null, headers, ...init } = options;
  const params = {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Init url
  let url = endpoint;

  // Endpoint start with GET|POST|PUT|PATCH|DELETE|HEAD|CONNECT|OPTIONS|TRACE
  const parts = endpoint.split(' ');
  if (['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE'].includes(parts[0])) {
    url = endpoint.slice(parts[0].length + 1);
    params.method = parts[0];
  }

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

  // Return native fetch
  return fetch(url, params)
    // Get response
    .then(response => {
      // Hook response
      _response(response);

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
    });
};
