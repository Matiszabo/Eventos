import pool from "../configs/db-config.js";
import bcrypt from 'bcryptjs'; // Importamos bcrypt para encriptar la contraseña

export default class UserRepository {
    login = async (username) => {
        const client = await pool.connect();
        try {
            const rta = await client.query(
                `SELECT * FROM users WHERE username = $1`, 
                [username]
            );
            
            if (rta.rows.length > 0) {
                return rta.rows[0];
            }
            return null;
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        } finally {
            client.release();
        }
    }

    crearUser = async (first_name, last_name, username, password) => {
        const client = await pool.connect();
        try {
            // Validar que todos los campos estén presentes
            if (!first_name || !last_name || !username || !password) {
                console.error('Faltan campos para registrar al usuario.');
                return false;
            }

            // Encriptar la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10);

            // Inserción del nuevo usuario en la base de datos con la contraseña encriptada
            await client.query(
                `INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)`,
                [first_name, last_name, username, hashedPassword] // Usar hashedPassword
            );
            return true;
        } catch (error) {
            console.error('Error during user creation:', error);
            return false;
        } finally {
            client.release();
        }
    }
}
