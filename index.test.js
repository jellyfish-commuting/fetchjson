const fetchjson = require('./index');
global.fetch = require('node-fetch');

// Start tests ...
describe('fetchjson', () => {
  // Fetch data successfully
  it('expect JSON while fetching public API', async () => {
    const result = await fetchjson('https://randomuser.me/api/', { results: 1 });

    expect(result).toMatchObject(
      expect.objectContaining({
        results: expect.any(Array),
      })
    );

    expect("Boom !").toBe("Boom !");
  });
});
