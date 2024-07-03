class ApiError extends Error {
  success: boolean;
  data: any;
  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public error: any = [],
    public stack: string = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.error = error),
      (this.message = message),
      (this.data = null),
      (this.success = false);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
