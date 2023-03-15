import { newGuid } from "../../../../utils/new-guid";

interface Entity {
  id: string;
}

class InMemoryDatabase {
  private data: { [key: string]: Entity[] } = {};

  addCollection<T extends Entity>(name: string): Entity[] {
    const collection = this.data[name];

    if (collection) {
      return collection
    }

    this.data[name] = [];

    return this.data[name];
  }

  add<T, Y extends Entity>(collectionName: string, entity: T): Y {
    let collection = this.data[collectionName];

    if (!collection) {
      collection = this.addCollection<Y>(collectionName);
    }

    const newObj = {
      ...entity,
      id: newGuid(),
    } as unknown as Y;

    collection.push(newObj);

    return newObj;
  }

  get<T extends Entity>(collectionName: string, id: string): T | undefined {
    const collection = this.data[collectionName];
    if (!collection) {
      throw new Error(`Collection '${collectionName}' does not exist.`);
    }

    return collection.find((entity) => entity.id === id) as T | undefined;
  }

  getAll<T extends Entity>(collectionName: string): T[] {
    const collection = this.data[collectionName];
    if (!collection) {
      throw new Error(`Collection '${collectionName}' does not exist.`);
    }

    return collection as T[];
  }

  update<T extends Entity>(collectionName: string, entity: T): void {
    const collection = this.data[collectionName];
    if (!collection) {
      throw new Error(`Collection '${collectionName}' does not exist.`);
    }

    const index = collection.findIndex((e) => e.id === entity.id);
    if (index === -1) {
      throw new Error(`Entity with ID ${entity.id} not found in collection '${collectionName}'.`);
    }

    collection[index] = entity;
  }

  remove<T extends Entity>(collectionName: string, id: string): void {
    const collection = this.data[collectionName];
    if (!collection) {
      throw new Error(`Collection '${collectionName}' does not exist.`);
    }

    const index = collection.findIndex((entity) => entity.id === id);
    if (index === -1) {
      throw new Error(`Entity with ID ${id} not found in collection '${collectionName}'.`);
    }

    collection.splice(index, 1);
  }

  reset() {
    this.data = {}
  }
}

const clientMemoryDB = new InMemoryDatabase();

export { clientMemoryDB }
