/**
 * Custom error classes for the Iconik API client
 */

export class IconikError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'IconikError';
  }
}

export class IconikAuthError extends IconikError {
  constructor(message: string) {
    super(message);
    this.name = 'IconikAuthError';
  }
}

export class IconikAPIError extends IconikError {
  public statusCode: number;
  public response: any;

  constructor(message: string, statusCode: number, response?: any) {
    super(message);
    this.name = 'IconikAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}
