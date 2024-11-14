// Repositories/users-repository.js
import pool from "../configs/db-config.js";
import pkg from 'pg';
import bcrypt from 'bcryptjs';
const { Client } = pkg;

export default class UserRepository {
    login = async (username, password) => {
        const client = await pool.connect(); 
        try {
            console.log('Buscando usuario con username:', username);
    
            const sql = 'SELECT * FROM users WHERE username = $1';
            const result = await client.query(sql, [username]);
    
            console.log('Resultado de la consulta:', result.rows);
    
            const user = result.rows[0];
    
            if (!user) {
                console.log('Usuario no encontrado');
                return null;
            }
    
            // Asegúrate de que el hash es válido y haz la comparación
            console.log('Hash almacenado en la base de datos:', user.password);
    
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            console.log('Comparación de contraseña:', isPasswordCorrect);
    
            if (isPasswordCorrect) {
                return user;
            } else {
                console.log('Contraseña incorrecta');
                return null;
            }
        } catch (error) {
            console.error('Error durante el login:', error);
            return null;
        } finally {
            client.release();
        }
    };
    
    crearUser = async (first_name, last_name, username, password) => {
        const client = await pool.connect();
        try {
            if (!first_name || !last_name || !username || !password) {
                console.error('Faltan campos para registrar al usuario.');
                return false;
            }
           
           
            await client.query(
                `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`,
                [first_name, last_name, username, password]
            );
            return true;
        } catch (error) {
            console.error('Error durante la creación de usuario:', error);
            return false;
        } finally {
            client.release();
        }
    }
    
}    