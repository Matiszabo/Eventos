import pkg from 'pg'
const { Client, Pool } = pkg;
import pool from "../configs/db-config.js"

export default class ProvincesRepository {

    getAllAsync = async () => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM provinces');
            return result.rows;
        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    }
    

    getByIdAsync = async (id) => {
        const client = await pool.connect();
        try {
            const result = await client.query('SELECT * FROM provinces WHERE id = $1 ', [id]);
            return result;
        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    }
     createAsync= async(province)  =>{
        const { id, name, full_name, latitude, longitude, display_order } = province;
        const client = await pool.connect();
        try {
            const result = await client.query('INSERT INTO provinces (id, name, full_name, latitude, longitude, display_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id, name, full_name, latitude, longitude, display_order]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

     updateAsync = async (province) =>{
        const { id, name, full_name, latitude, longitude, display_order } = province;
        const client = await pool.connect();
        try {
            const result = await client.query('UPDATE provinces SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5 WHERE id = $6', [name, full_name, latitude, longitude, display_order, id]);
            return result;
        } finally {
            client.release();
        }
    }
    deleteAsync = async (id) => {
        const client = await pool.connect();
        try {
            const result = await client.query('DELETE FROM public.provinces WHERE id = $1', [id]);
            return result;
        } finally {
            client.release();
        }
    }
}
 
