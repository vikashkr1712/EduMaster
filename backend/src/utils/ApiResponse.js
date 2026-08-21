export class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    const response = {
      success: true,
      message: this.message,
    };
    if (this.data !== null) {
      response.data = this.data;
    }
    return response;
  }
}
