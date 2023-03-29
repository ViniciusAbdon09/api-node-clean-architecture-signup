import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";
import { clientMemoryDB } from "../helpers/repository-in-memory-helper";

export class LogMomoryRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    clientMemoryDB.addCollection('errors');
    clientMemoryDB.add<{ stack: string }, { id: string, stack: string, created_at: Date }>('errors', { stack })
  }
}
