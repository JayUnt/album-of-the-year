export interface UserInterface {
    id: string;
    email: string;
    auth0Id: string;
}

export interface CreateUserInterface extends Omit<UserInterface, 'id' | 'createdAt' | 'updatedAt'> {}