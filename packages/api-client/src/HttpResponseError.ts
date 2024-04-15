export class HttpResponseError extends Error {
  constructor(
    public readonly statusCode: number,
    message?: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly data?: any,
  ) {
    super(message);
    this.name = 'HttpResponseError';
  }
}
