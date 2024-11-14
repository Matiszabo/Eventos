import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsersService from "../services/users-service.js";

const UserRouter = Router();
const svc = new UsersService();
const JWT_SECRET = 'KvduPPiIG7NJ2Quhk5jGMy6z2YizmG';


UserRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, username, password } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({ message: 'Los campos first_name o last_name están vacíos.' });
        }
        if (!username) {
            return res.status(400).json({ message: 'El email (username) es sintácticamente inválido.' });
        }
        if (password.length < 8) { 
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);
        const newUser = await svc.crearUser({ first_name, last_name, username, password: hashedPassword });
        
        if (newUser) {
            res.status(201).json({ message: 'Usuario registrado exitosamente', newUser });
        } else {
            res.status(400).json({ message: 'Error al registrar el usuario.' });
        }
    } catch (error) {   
        console.error('Error durante el registro:', error);
        res.status(500).json({ message: error.message });
    }
});




UserRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        console.log('Parametros recibidos:', { username, password }); 

        if (!username || !password) {
            return res.status(400).json({ message: 'Faltan parámetros' });
        }

        const user = await svc.login(username, password);

        console.log('Resultado del login:', user); 
        
        if (user) {
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '365d' });
            res.status(200).json({ user, token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
        res.status(500).json({ message: error.message });
    }
});

export default UserRouter;