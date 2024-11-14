import UserRepository from '../repositories/users-repository.js';

export default class UsersService {
    constructor() {
        this.repos = new UserRepository();
    }

    login = async (username, password) => {
        return this.repos.login(username, password);
    };

    crearUser = async (userData) => {
       
        const { first_name, last_name, username, password } = userData;
        return this.repos.crearUser(first_name, last_name, username, password);
    };
}