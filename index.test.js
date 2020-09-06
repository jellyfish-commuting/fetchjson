const fetchjson = require('./index');
global.fetch = require('node-fetch');

// Start tests ...
describe('fetchjson', () => {
  // Fetch data successfully
  it('expect JSON while fetching public API', async () => {
    const result = await fetchjson('https://randomuser.me/api/', { data: { results: 1 } });

    expect(result).toMatchObject(
      expect.objectContaining({
        results: expect.any(Array),
      })
    );
  });

  // Callback
  it('expect callbacks working while fetching public API', async () => {
    // Init flags
    let start = null;
    let response = null;
    let complete = null;

    // Fetch
    await fetchjson('https://randomuser.me/api/', {
      data: { results: 1 },
      onStart: () => start = true,
      onResponse: () => response = true,
      onComplete: () => complete = true,
    });

    // Tests
    expect(start).toBe(true);
    expect(response).toBe(true);
    expect(complete).toBe(true);
  });
});
