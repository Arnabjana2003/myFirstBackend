class ApiResponse {
  constructor(statusCode, message = Success, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = true;
    this.data = data;
  }
}

export default ApiResponse;
