import { LogControllerDecorator } from "."
import { LogErrorRepository } from "../../../data/protocols/db/log/log-error-repository";
import { serverError } from "../../../presentation/helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../../presentation/protocols";

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'Vinicius',
          email: 'vini@gmail.com'
        }
      }
      return Promise.resolve(httpResponse);
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator,
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    controllerStub,
    sut,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Vinicius',
        email: 'vini@gmail.com'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const fakeError = new Error();
    fakeError.stack = 'any_stack';

    const error = serverError(fakeError);
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    jest.spyOn(controllerStub, 'handle').mockImplementationOnce(() => new Promise(resolve => resolve(error)));

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    await sut.handle(httpRequest);

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
