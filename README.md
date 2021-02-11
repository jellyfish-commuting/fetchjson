[![Version](https://img.shields.io/npm/v/@jollie/fetchjson)](https://www.npmjs.com/package/@jollie/fetchjson)
[![Licence](https://img.shields.io/npm/l/@jollie/fetchjson)](https://en.wikipedia.org/wiki/MIT_license)
[![Build](https://img.shields.io/travis/thejellyfish/fetchjson)](https://travis-ci.org/github/thejellyfish/fetchjson)
[![Coverage](https://img.shields.io/codecov/c/github/thejellyfish/fetchjson)](https://codecov.io/gh/thejellyfish/fetchjson)
[![Downloads](https://img.shields.io/npm/dt/@jollie/fetchjson)](https://www.npmjs.com/package/@jollie/fetchjson)

__*for internal use only - Just draft idea to easily fetch API in our apps*__

# fetchjson
Fetch wrapper to easily request an API, simply create a native fetch initialized with :
- header `Content-Type=application/json`
- default hostname & authorization credentials
- optional method prefix

### Install

```bash
yarn add @jollie/fetchjson
```
or
```bash
npm install @jollie/fetchjson
```
### Usage

```javascript
import makeFetch from '@jollie/fetchjson';

// Create fetchjson to consume your API
const fetchjson = makeFetch('api.vendor-domain.io', 'API_KEY');

// Create
fetchjson('POST v1/users', { firstname: 'John', lastname: 'Doe' })
  .then(({ id )} => console.log(`User #${id} created successfully !`));

// Update
fetchjson('PUT v1/users/1', { firstname: 'Johnna' })
  .then(() => console.log('User updated successfully !'));

// Delete
fetchjson('DELETE v1/users/1')
  .then(() => console.log('User deleted successfully !'));

// Retrieve http response 
// payload has a not enumerable prop "_response"
fetchjson('v1/users')
  .then(payload => {
    const header = payload._response.headers.get('x-powered-by');
    console.log(`Powered by ${header || 'Unknow'}`),
  });
```

### Params

```javascript
const fetchjson = makeFetch(domain, api_key);
```

| Prop            | Type       |  Note                                                                                    |
|-----------------|------------|------------------------------------------------------------------------------------------|
| `domain`        | `string`   | domain of your api                                                                       |
| `api_key`       | `string`   | Token for Authorization header `Bearer {api_key}`                                        |
      

makeFetch return function with following params    

```javascript
fetchjson(url, data, init);
```

| Prop               | Type     |  Note                                                                                                                           |
|--------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| `url`              | `string` | URL to fetch <br />Could be prefixed by a http method `fetchjson('POST https://fake-api.io/v1/users')`                          |
| `data`             | `object` | queryString or Body param according http method                                                                                 |
| `init`<sup>1</sup> | `object` | Init arg passed to native fetch - [see fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) |

### Return value

Promise resolve with json payload
