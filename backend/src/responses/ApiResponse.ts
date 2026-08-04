export class ApiResponse<T> {
  public success: boolean;
  public message: string;
  public data?: T;
  public meta?: Record<string, unknown>;

  constructor(success: boolean, message: string, data?: T, meta?: Record<string, unknown>) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (meta !== undefined) this.meta = meta;
  }

  static success<T>(data: T, message = 'Success', meta?: Record<string, unknown>) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message = 'An error occurred', data?: any) {
    return new ApiResponse(false, message, data);
  }
}
