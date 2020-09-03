import request, {
  onFetchingWillStart,
  onFetchingComplete,
  onFetchingSuccess,
  onFetchingError,
} from './index'
global.fetch = require('node-fetch');

// Start tests ...
describe('Request', () => {
  // Fetch data successfully
  it('expect JSON while fetching public API', async () => {
    const result = await request('GET', 'https://randomuser.me/api/', { results: 1 });

    expect(result).toMatchObject(
      expect.objectContaining({
        results: expect.any(Array),
      })
    );
  });

  // Fetching callback
  it('expect callbacks working while fetching public API', async () => {
    // Init flags
    let willStart = null;
    let complete = null;
    let success = null;

    // Apply callback
    onFetchingWillStart(() => { willStart = true; });
    onFetchingComplete(() => { complete = true });
    onFetchingSuccess(() => { success = true });

    // Fetch
    await request('GET', 'https://randomuser.me/api/', { results: 1 });

    // Tests
    expect(willStart).toBe(true);
    expect(complete).toBe(true);
    expect(success).toBe(true);
  });

  // Fetching error
  it('expect error callback while fetching bad json', async () => {
    // Init flags
    let error = null;

    // Apply callback
    onFetchingError(() => { error = true; });

    // Fetch
    try {
      await request('GET', 'https://randomuser.me/');
    } catch (error) {}

    // Tests
    expect(error).toBe(true);
  });

  // Fetching error
  it('expect error callback while fetching 404', async () => {
    // Init flags
    let error = null;

    // Apply callback
    onFetchingError(() => { error = true; });

    // Fetch
    try {
      await request('GET', 'https://randomuser.me/404/');
    } catch (error) {}

    // Tests
    expect(error).toBe(true);
  });

  // Fetching error
  it('expect error callback while fetching invalid url', async () => {
    // Init flags
    let error = null;

    // Apply callback
    onFetchingError(() => { error = true; });

    // Fetch
    try {
      await request('GET', 'https://iam.notexists/');
    } catch (error) {}

    // Tests
    expect(error).toBe(true);
  });
});
