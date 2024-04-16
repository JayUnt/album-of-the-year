import { Prisma } from "@repo/prisma";
import { UserRepository } from "@repo/prisma/src/repositories/user.repository";
import { UserInterface, CreateUserInterface } from "@repo/types";

export class UserService {
  #userRepository: UserRepository;

  constructor() {
    this.#userRepository = new UserRepository();
  }

  #mapUserToInterface = (user: any): UserInterface => {
    return {
      id: user.id,
      email: user.email,
      auth0Id: user.auth0Id,      
    };
  };

  async getById(id: string): Promise<UserInterface | null> {
    return await this.#userRepository
      .getById(id)
      .then((user) => {
        if (!user) {
          throw new Error("No user found");
        }
        return user
      })
      .then(this.#mapUserToInterface);
  }

  async getByEmail(email: string): Promise<UserInterface | null> {
    return await this.#userRepository
      .getByEmail(email)
      .then((user) => {
        if (!user) {
          throw new Error("No user found");
        }
        return user
      })
      .then(this.#mapUserToInterface);
  }

  async create(user: CreateUserInterface): Promise<UserInterface> {
    return await this.#userRepository
      .create(user)
      .then(this.#mapUserToInterface);
  }

  async update(user: UserInterface): Promise<UserInterface> {
    return await this.#userRepository
      .update(user)
      .then(this.#mapUserToInterface);
  }
}
