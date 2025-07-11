import { IconikClient } from '../index';
import { IconikConfig } from '../config';
import { IconikAuthError, IconikAPIError } from '../errors';

describe('IconikClient', () => {
  const config: IconikConfig = {
    appId: 'test-app-id',
    authToken: 'test-auth-token',
    baseUrl: 'https://app.iconik.io/v1',
    debug: true,
  };

  let client: IconikClient;

  beforeEach(() => {
    client = new IconikClient(config);
  });

  it('should create a client instance', () => {
    expect(client).toBeInstanceOf(IconikClient);
  });

  it('should have HTTP methods available', () => {
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
    expect(typeof client.patch).toBe('function');
  });

  // Add more tests as needed for specific API endpoints
});
