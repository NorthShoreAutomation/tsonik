import { Tsonik } from '../index';
import { IconikConfig } from '../config';

describe('Tsonik', () => {
  const config: IconikConfig = {
    appId: 'test-app-id',
    authToken: 'test-auth-token',
    baseUrl: 'https://app.iconik.io/v1',
    debug: true,
  };

  let client: Tsonik;

  beforeEach(() => {
    client = new Tsonik(config);
  });

  it('should create a client instance', () => {
    expect(client).toBeInstanceOf(Tsonik);
  });

  it('should have HTTP methods available', () => {
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
    expect(typeof client.patch).toBe('function');
  });

  it('should return client information', () => {
    const clientInfo = client.getClientInfo();
    
    expect(clientInfo.name).toBe('tsonik');
    expect(typeof clientInfo.version).toBe('string');
    expect(clientInfo.baseUrl).toBe(config.baseUrl);
    expect(typeof clientInfo.userAgent).toBe('string');
  });

  // Add more tests as needed for specific API endpoints
});
