import { Request, Response } from "express";
import { Controller, HttpRequest } from "../../../presentation/protocols";

export const adapteRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const httpResponse = await controller.handle(httpRequest);
    response.status(httpResponse.statusCode).json(httpRequest.body)
  }
}
