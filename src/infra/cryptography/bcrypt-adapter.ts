import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from 'bcrypt';
import { HashComparer } from "../../data/protocols/criptography/hash-compare";

export class BcryptAdapter implements Hasher, HashComparer {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async hash(value: string): Promise<string> {
    const hashed = await bcrypt.hash(value, this.salt);
    return hashed;
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(value, hashedValue);
    return isMatch;
  }
}
