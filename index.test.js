const fetchjson = require('./index');
global.fetch = require('node-fetch');

// Start tests ...
/* eslint-disable no-undef */
describe('fetchjson', () => {
  // Fetch data successfully
  it('expect JSON while fetching public API', async () => {
    const result = await fetchjson('https://randomuser.me/api/', { results: 1 });

    expect(result).toMatchObject(
      expect.objectContaining({
        results: expect.any(Array),
      }),
    );
  });

  // Fetch data successfully
  it('expect JSON while fetching with a default hostname', async () => {
    // Fetch
    const result = await fetchjson('api', { results: 1 }, { hostname: 'https://randomuser.me' });

    expect(result).toMatchObject(
      expect.objectContaining({
        results: expect.any(Array),
      }),
    );
  });

  // Callback
  it('expect callback _response working while fetching public API', async () => {
    // Init flag
    let response = null;

    // Fetch
    // eslint-disable-next-line no-return-assign
    await fetchjson('https://randomuser.me/api/', { results: 1 }, { _response: r => response = r });

    // Tests
    expect(response).toEqual(expect.objectContaining({
      ok: expect.any(Boolean),
      status: expect.any(Number),
    }));
  });
});
