const { _queryString, _trimStart } = require('@jellyfish-commuting/helpers');

// Default http error message
const HTTP_ERRORS = {
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Time-out',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request-URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested range unsatisfiable',
  417: 'Expectation failed',
  418: 'I’m a teapot',
  421: 'Bad mapping / Misdirected Request',
  422: 'Unprocessable entity',
  423: 'Locked',
  424: 'Method failure',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  449: 'Retry With',
  450: 'Blocked by Windows Parental Controls',
  451: 'Unavailable For Legal Reasons',
  456: 'Unrecoverable Error',
  444: 'No Response',
  495: 'SSL Certificate Error',
  496: 'SSL Certificate Required',
  497: 'HTTP Request Sent to HTTPS Port',
  498: 'Token expired/invalid',
  499: 'Client Closed Request',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway ou Proxy Error',
  503: 'Service Unavailable',
  504: 'Gateway Time-out',
  505: 'HTTP Version not supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient storage',
  508: 'Loop detected',
  509: 'Bandwidth Limit Exceeded',
  510: 'Not extended',
  511: 'Network authentication required',
};

// Create native fetch
function fetchjson(endpoint, data, options = {}) {
  // Extract options
  const {
    hostname,
    authorization,
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
      url = `${_trimStart(hostname, '/')}/${_trimStart(url, '/')}`;
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
    // Return response in JSON
    .then(response => {
      if (response.status === 204) {
        return Object.defineProperty({}, '_response', { get: () => response });
      }

      return response.json().then(payload => {
        // Error ?
        if (!response.ok) {
          const error = new Error((payload || {}).message || HTTP_ERRORS[response.status] || 'Unexpected error occurred');
          error.code = response.status;

          throw error;
        }

        // Add non enumerable _response property
        Object.defineProperty(payload, '_response', { get: () => response });

        // Return JSON payload
        return payload;
      });
    });
}

// Export
module.exports = fetchjson;
