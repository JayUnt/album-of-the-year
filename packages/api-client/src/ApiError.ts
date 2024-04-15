import {HttpResponseError} from '@apps/common/http';

export class ApiError extends HttpResponseError {
  public errorCode?: string;
  public detail?: string;

  constructor(
    statusCode: number,
    message?: string,
    errorCode?: string,
    detail?: string,
  ) {
    super(statusCode, message);
    this.errorCode = errorCode;
    this.detail = detail;
  }
}
