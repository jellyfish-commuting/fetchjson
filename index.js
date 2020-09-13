const { _queryString, _trimStart } = require('@jellyfish-commuting/helpers');

// Create native fetch
function fetchjson(endpoint, data, options = {}) {
  // Extract options
  const {
    hostname,
    authorization,
    grabResponse = () => null,
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
  // eslint-disable-next-line prefer-const
  let [prefix, url] = endpoint.split(' ');

  // Endpoint prefix ?
  if (url) {
    params.method = prefix;

  // ... no
  } else {
    url = prefix;
  }

  // Has default hostname ?
  if (hostname) {
    // Preprend hostname ?
    if (!url.startsWith('https://')) {
      url = `${hostname}/${_trimStart(url, '/')}`;
    }

    // Add credentials ?
    if (authorization && url.startsWith(hostname)) {
      params.headers.Authorization = authorization;
    }
  }

  // Data ?
  if (data) {
    // Query params ?
    if (!params.method || ['GET', 'HEAD', 'OPTIONS'].includes(params.method)) {
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
      // Grab response
      grabResponse(response);

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
}

// Export
module.exports = fetchjson;
