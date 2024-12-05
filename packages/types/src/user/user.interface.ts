export interface UserInterface {
    id: string;
    email: string;
    auth0Id: string;
}

export interface CreateUserInterface {
    id: UserInterface['id'];
    email: UserInterface['email'];
    auth0Id: UserInterface['auth0Id'];
}
