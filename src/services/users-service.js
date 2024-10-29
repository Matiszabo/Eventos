import UserRepository from '../repositories/users-repository.js';

export default class UsersService {
    constructor() {
        this.repos = new UserRepository();
    }

    login = async (username) => {
        return this.repos.login(username);
    }

    crearUser = async ({ first_name, last_name, username, password }) => {
        return this.repos.crearUser(first_name, last_name, username, password);
    }
}
