const ErrorEmums = Object.freeze({
  /* General Errors */
  QUERY_LIMIT_EXCEED: 'QUERY-LIMIT-EXCEED',
  INVALID_ID: 'INVALID-ID',
  INVALID_VALUE: 'INVALID-VALUE',
  INVALID_FIELD: 'INVALID-FIELD',
  DUPLICATE_KEY: 'DUPLICATE-KEY',
  NOT_FOUND: 'NOT-FOUND',
  USER_ID_NOT_FOUND: 'USER-ID-NOT-FOUND',
  SERVER_READ: 'BE-R-ISE',

  /* User Creation */
  EMAIL_MISSING: 'EMAIL-MISSING',
  INVALID_EMAIL: 'INVALID-EMAIL',
  EMAIL_ALREADY_EXIST: 'EMAIL-ALREADY-EXIST',

  /* Date Errors */
  INVALID_DATE: 'INVALID-DATE',
  DATE_NOT_EXISTS: 'DATE-NOT-EXISTS',
});

export default ErrorEmums;