class ApiResponse {
  success;
  constructor(
    public data: any,
    public statusCode: number,
    public message: string = "Success"
  ) {
    (this.message = message),
      (this.data = data),
      (this.statusCode = statusCode),
      (this.success = statusCode < 400);
  }
}

export { ApiResponse };
