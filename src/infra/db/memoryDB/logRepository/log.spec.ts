import { clientMemoryDB } from "../helpers/repository-in-memory-helper";
import { LogMomoryRepository } from "./log";

describe('Log DB Memory', () => {
  afterAll(() => {
    clientMemoryDB.reset();
  })

  beforeEach(() => {
    clientMemoryDB.reset();
    clientMemoryDB.addCollection('errors');
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMomoryRepository();
    await sut.logError('any_error');

    const count = clientMemoryDB.getAll('errors').length;

    expect(count).toBe(1)
  })
})
