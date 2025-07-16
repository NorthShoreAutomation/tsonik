// Mock for p-retry module to avoid ES module issues in Jest
export default async function mockRetry<T>(
  fn: (attemptNumber: number) => Promise<T>,
  options?: any
): Promise<T> {
  // For testing, just call the function directly without retries
  return fn(1);
}

export class AbortError extends Error {
  constructor(message: string | Error) {
    super(typeof message === 'string' ? message : message.message);
    this.name = 'AbortError';
  }
}

mockRetry.AbortError = AbortError;