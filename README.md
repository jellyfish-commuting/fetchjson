[![Version](https://img.shields.io/npm/v/@jellyfish-commuting/fetchjson)](https://www.npmjs.com/package/@jellyfish-commuting/fetchjson)
[![Licence](https://img.shields.io/npm/l/@jellyfish-commuting/fetchjson)](https://en.wikipedia.org/wiki/MIT_license)
[![Build](https://img.shields.io/travis/jellyfish-commuting/fetchjson)](https://travis-ci.org/github/jellyfish-commuting/fetchjson)
[![Coverage](https://img.shields.io/codecov/c/github/jellyfish-commuting/fetchjson)](https://codecov.io/gh/jellyfish-commuting/fetchjson)
[![Downloads](https://img.shields.io/npm/dt/@jellyfish-commuting/fetchjson)](https://www.npmjs.com/package/@jellyfish-commuting/fetchjson)

__*for internal used only - Just draft idea to easily fetch API in our apps*__

# fetchjson
Fetch wrapper to easily request an API, simply create a native fetch initialized with :
- header `Content-Type=application/json`
- default hostname & authorization credentials params
- optional method prefix `fetchjson('POST https://fake-api.io/v1/users')`

### Install

```bash
yarn add @jellyfish-commuting/fetchjson
```
or
```bash
npm install @jellyfish-commuting/fetchjson
```
### Usage

```javascript
import fetchjson from '@jellyfish-commuting/fetchjson';

// Fetch data with query params: https://fake-api.io/users?limit=10
fetchjson('https://fake-api.io/v1/users', { limit: 10 })
  .then(payload => console.log(payload));

// Create
fetchjson('POST https://fake-api.io/v1/users', { 
 firstname: 'John', 
 lastname: 'Doe', 
})
  .then(({ id )} => console.log(`User #${id} created successfully !`));

// Update
fetchjson('PUT https://fake-api.io/v1/users/1', { firstname: 'Johnna' })
  .then(() => console.log('User updated successfully !'));

// Delete
fetchjson('DELETE https://fake-api.io/v1/users/1')
  .then(() => console.log('User deleted successfully !'));

// Set a default hostname
fetchjson('v1/users', { limit: 10 }, { hostname: 'https://fake-api.io' });

```

### Params

```javascript
fetchjson(url, data, init);
```

| Prop   | Type     |  Note                                                                                                                           |
|--------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| `url`  | `string` | URL to fetch <br />Could be prefixed by a http method `fetchjson('POST https://fake-api.io/v1/users')`                          |
| `data` | `object` | queryString or Body param according http method                                                                                 |
| `init` | `object` | Init arg passed to native fetch - [see fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) |

### Extra params

`init` argument can be extends with following optional properties

| Prop            | Type       |  Note                                                                                    |
|-----------------|------------|------------------------------------------------------------------------------------------|
| `hostname`      | `string`   | Prepend URL with hostname if url don't start by a domain                                 |
| `authorization` | `string`   | Authorization header <br />Ignored if url don't start by `hostname` property             |
| `grabResponse`  | `function` | callback to grab the response                                                            |
    
```javascript
const init = {
 hostname: 'https://fake-api.io',
 authorization: 'Bearer API_KEY',
 grapResponse: response => {
   const header = response.headers.get('x-powered-by') || 'Unknow';
   console.log(`Powered by ${header}`),
 }
};

// Endpoint will be prepend with hostname
fetchjson('POST v1/users', { firstname: 'John' }, init);

// Authorization will be ignored 
// -> hostname is different than init.hostname
fetchjson('https://vendor-api.io/v1/my-account', init);
```

### Return value

JSON response - [more infos](https://developer.mozilla.org/en-US/docs/Web/API/Body/json)
