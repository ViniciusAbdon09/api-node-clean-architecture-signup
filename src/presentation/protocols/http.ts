export interface HttpResponse<T = any> {
  statusCode: number;
  body: T;
}

export interface HttpRequest {
  body?: any;
}
