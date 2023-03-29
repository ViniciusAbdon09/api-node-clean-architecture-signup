import { LogErrorRepository } from "../../../data/protocols/log-error-repository";
import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";

export class LogControllerDecorator<T = any> implements Controller {
  constructor(
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) { }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<T>> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) {
      console.error(httpResponse.body, new Date())
      await this.logErrorRepository.logError(httpResponse.body.stack)
    }

    return httpResponse;
  }
}
