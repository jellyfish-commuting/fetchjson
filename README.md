[![Version](https://img.shields.io/npm/v/@jellyfish-commuting/fetchjson)](https://www.npmjs.com/package/@jellyfish-commuting/fetchjson)
[![Licence](https://img.shields.io/npm/l/@jellyfish-commuting/fetchjson)](https://en.wikipedia.org/wiki/MIT_license)
[![Build](https://img.shields.io/travis/jellyfish-commuting/fetchjson)](https://travis-ci.org/github/jellyfish-commuting/fetchjson)
[![Coverage](https://img.shields.io/codecov/c/github/jellyfish-commuting/fetchjson)](https://codecov.io/gh/jellyfish-commuting/fetchjson)
[![Downloads](https://img.shields.io/npm/dt/@jellyfish-commuting/fetchjson)](https://www.npmjs.com/package/@jellyfish-commuting/fetchjson)

# fetchjson
Fetch wrapper to easily request an API          
Simply create a native fetch initialized with :
- header Content-Type=application/json  
- return a json response    



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

// Fetch data
fetchjson('https://fake-api.io/v1/users')
  .then(response => console.log(response));
  
// Pass params: https://fake-api.io/users?limit=10
fetchjson('https://fake-api.io/v1/users', { limit: 10 })
  .then(response => console.log(response));

// Create 
fetchjson('POST https://fake-api.io/v1/users', { firstname: 'John', lastname: 'Doe' })
  .then(response => console.log(response));

// Update
fetchjson('PUT https://fake-api.io/v1/users/1', { firstname: 'Johnna' })
  .then(response => console.log(response));

// Delete
fetchjson('DELETE https://fake-api.io/v1/users/1')
  .then(response => console.log(response));

/**
 * Example: 
 * --------
 * Create function to be used in whole app
 */
function myfetch(endpoint, data, params) {
  return fetchjson(endpoint, data, { ...params, _hostname: 'https://fake-api.io' });
}

// Now, can request by
myfetch('v1/users', { limit: 10 });  // hostname will be added
myfetch('PUT v1/users/1', { firstname: 'Johnna' });  // hostname will be added
myfetch('https://randomuser.me/api');  // hostname will NOT be added

```

### Params

```javascript
fetchjson(url, data, params);
```

| Prop   | Type     |  Note                                     |
|--------|----------|-------------------------------------------|
| `url`  | `string` | Could prefixed by a http method           |
| `data` | `object` | queryString or Body param according http method  |
| `init` | `object` | Init arg passed to native fetch see [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) |


### Return value

Native fetch
