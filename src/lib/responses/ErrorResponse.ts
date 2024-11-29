class ErrorResponse extends Error {
  statusCode: number;
  readonly success: boolean;
  readonly result: any;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.result = null;
    this.success = false;
  }
}

export default ErrorResponse;
