import StatusCodesEmums from '../enums/StatusCodeEnums';
import { CustomError } from './CustomError';

export class BadRequestError extends CustomError {
  statusCode = StatusCodesEmums.BAD_REQUEST;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
