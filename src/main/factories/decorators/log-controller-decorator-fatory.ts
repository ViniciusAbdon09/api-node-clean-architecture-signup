import { LogMomoryRepository } from "../../../infra/db/memoryDB/logRepository/log-memory-repository";
import { Controller } from "../../../presentation/protocols";
import { LogControllerDecorator } from "../../decorators/logs";

export function makeLogControllerDecorator<T = any>(controller: Controller): Controller {
  const errorRepository = new LogMomoryRepository();
  return new LogControllerDecorator<T>(controller, errorRepository);
}
