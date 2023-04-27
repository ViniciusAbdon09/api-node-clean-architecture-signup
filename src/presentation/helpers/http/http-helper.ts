import { ServerError, UnathorizedError } from "../../error";
import { HttpResponse } from "../../protocols/http"

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const unauthorizedRequest = (): HttpResponse => ({
  statusCode: 401,
  body: new UnathorizedError()
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
});


export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
});

export const ok = <T>(data: T): HttpResponse<T> => ({
  statusCode: 200,
  body: data
});

