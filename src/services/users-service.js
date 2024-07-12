import UserRepository from '../repositories/users-repository.js';

export default class UsersService {
    constructor() {
        this.repos = new UserRepository();
    }
    login = async (username, password) => {
        const user= this.repos.login(username, password);
        if (user) {
          return { id: user.id, username: user.username }; 
      }
      return null;
      }
    crearUser(id, first_name, last_name, username, password) {
        return this.repos.crearUser(id, first_name, last_name, username, password);
    }
}

