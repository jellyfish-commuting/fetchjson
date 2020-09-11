const { _queryString, _trimStart } = require('@jellyfish-commuting/helpers');

// Create native fetch
function fetchjson(endpoint, data, options = {}) {
  // Extract options
  const {
    _response = () => null,
    headers,
    ...init
  } = options;

  // Init params
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

  // Add hostname ?
  if (fetchjson._hostname && !url.includes(fetchjson._hostname)) {
    url = `${fetchjson._hostname}/${_trimStart(url, '/')}`;
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
  // eslint-disable-next-line no-undef
  return fetch(url, params)
    // Get response
    .then(response => {
      // Hook response
      _response(response);

      // Return response in JSON
      return response.json().then(payload => {
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

// Export
module.exports = fetchjson;
