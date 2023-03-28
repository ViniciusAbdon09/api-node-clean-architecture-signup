import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";

export class LogControllerDecorator<T> implements Controller {
  constructor(private readonly controller: Controller) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<T>> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      console.error(httpResponse.body, new Date())
    }

    return httpResponse;
  }
}
