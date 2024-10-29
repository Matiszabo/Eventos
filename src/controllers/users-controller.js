import { Router } from 'express';
import UsersService from "../services/users-service.js";
import jwt from 'jsonwebtoken';
import {authenticateToken} from '../middlewares/auth-middleware.js'; // Importamos el middleware

const UserRouter = Router();
const svc = new UsersService();
const JWT_SECRET = 'your_jwt_secret'; // Asegura que coincida con el segundo código

UserRouter.post('/register', async (req, res) => {
    const { first_name, last_name, username, password } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ message: 'Los campos first_name o last_name están vacíos.' });
    }

    if (!username) {
        return res.status(400).json({ message: 'El email (username) es sintácticamente inválido.' });
    }

    if (password.length < 3) {
        return res.status(400).json({ message: 'El campo password tiene menos de 3 letras.' });
    }

    try {
        // Registrar al usuario
        const newUser = await svc.crearUser({  first_name, last_name, username, password });
        if (!newUser) {
            return res.status(400).json({ message: 'Error al registrar el usuario.' });
        }

        // Generar token JWT usando la contraseña como base
        const token = jwt.sign({ password }, JWT_SECRET, { expiresIn: '365d' });

        // Devolver el token junto con la respuesta
        res.status(201).json({ message: 'Usuario registrado exitosamente', newUser, token });
    } catch (error) {
        console.error('Error durante el registro:', error);
        res.status(500).json({ message: error.message });
    }
});

// Ruta para iniciar sesión
UserRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await svc.login(username, password); // Autentica al usuario
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generamos el token con el id del usuario
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '365d' });
        res.status(200).json({ user, token }); // Devuelve el usuario y el token
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).json({ message: error.message });
    }
});



export default UserRouter;
