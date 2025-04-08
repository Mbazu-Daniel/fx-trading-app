import * as argon2 from "argon2";

export default class PasswordHelper {
  static async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  static async verifyPassword(
    password: string,
    plainPassword: string
  ): Promise<boolean> {
    return argon2.verify(password, plainPassword);
  }
}
