import StatusCodesEmums from '../enums/StatusCodeEnums';
import { CustomError } from './CustomError';

export class NotFoundError extends CustomError {
  statusCode = StatusCodesEmums.NOT_FOUND;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
