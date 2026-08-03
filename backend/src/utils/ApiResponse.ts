export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;
  public errors?: any;

  constructor(success: boolean, message: string, data?: T, errors?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(message: string, data?: T) {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, errors?: any) {
    return new ApiResponse(false, message, undefined, errors);
  }
}
