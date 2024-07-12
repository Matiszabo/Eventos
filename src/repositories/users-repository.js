import pool from "../configs/db-config.js";
import pkg from "pg";
const { Pool } = pkg;

export default class UserRepository {
  

    login = async (username, password) => {
        const client = await pool.connect();
        try {
            const rta = await client.query(
                `SELECT * FROM users WHERE username = $1 AND password = $2`, 
                [username, password]
            );
            const values = [username, password]
            if (res.rows.length > 0 ){
                return res.rows[0];
            }
        } catch (error) {
            console.error(error);
        } 
    }
        crearUser = async (id, first_name, last_name, username, password) => {
            const client = await pool.connect();
            try {
                await client.query(
                    `INSERT INTO users (id, first_name, last_name, username , password) VALUES ($1, $2, $3, $4, $5)`,
                    [id, first_name, last_name, username, password]
                );
                return true;
            } catch (error) {
                console.error(error);
                return false;
            } finally {
                client.release();
            }
        }
    }

