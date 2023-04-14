import { Request, Response } from "express";
import { Controller, HttpRequest } from "../../../presentation/protocols";

export const adapteRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      return response.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      const messageError = httpResponse.body.message ?? 'Something unexpected happened, try again later';
      return response.status(httpResponse.statusCode).json({ error: messageError })
    }
  }
}
