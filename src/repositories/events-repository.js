import pkg from 'pg'
import DBConfig from "../configs/db-config.js"
import pool from "../configs/db-config.js";
const { Client, Pool } = pkg;
export default class EventRepository {
    searchEvents = async (filters) => {
    const client = await pool.connect();
    const { name, category, startdate, tag, limit, offset } = filters;
    const conditions = [];
    const values = [];

    if (name) {
        values.push(`%${name}%`);
        conditions.push(`e.name ILIKE $${values.length}`);
    }
    if (category) {
        values.push(`%${category}%`);
        conditions.push(`c.name ILIKE $${values.length}`);
    }
    if (startdate) {
        values.push(startdate);
        conditions.push(`DATE(e.start_date) = $${values.length}`);
        console.log(values.length);
    }
    if (tag) {
        values.push(`%${tag}%`);
        conditions.push(`t.name ILIKE $${values.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
        SELECT 
            e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price, e.enabled_for_enrollment, el.max_capacity,
            u.id as creator_user_id, u.first_name as creator_user_first_name, u.last_name as creator_user_last_name, u.username as creator_user_username,
            c.id as category_id, c.name as category_name,
            el.id as location_id, el.name as location_name, el.full_address as location_full_address
        FROM events e
        JOIN users u ON e.id_creator_user = u.id
        JOIN event_categories c ON e.id_event_category = c.id
        JOIN event_locations el ON e.id_event_location = el.id
        LEFT JOIN event_tags et ON e.id = et.id_event
        LEFT JOIN tags t ON et.id_tag = t.id
        ${whereClause}
        ORDER BY e.start_date DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    values.push(limit, offset);

    try {
        const res = await client.query(query, values);

        const countQuery = `
            SELECT COUNT(*)
            FROM events e
            JOIN event_categories c ON e.id_event_category = c.id
            LEFT JOIN event_tags et ON e.id = et.id_event
            LEFT JOIN tags t ON et.id_tag = t.id
            ${whereClause}
        `;
        const countRes = await client.query(countQuery, values.slice(0, values.length - 2));
        const total = parseInt(countRes.rows[0].count, 10);

        return {
            events: res.rows,
            total
        };
    } finally {
        client.release();
    }
};

 getById = async (eventId) => {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT * FROM events WHERE id = $1', [eventId]);
        return res.rows[0];
   
    } finally {
        client.release();
    }
};

listParticipantes = async (id, firstName, lastName, username, attended, rating) => {
        const client = await pool.connect();
        let query = (`SELECT json_build_object(
            'id', u.id, 
            'first_name', u.first_name, 
            'last_name', u.last_name, 
            'username', u.username
        ) AS user, ee.attended, ee.rating, ee.description
        FROM users u 
        INNER JOIN event_enrollments ee ON u.id = ee.id_user
        WHERE ee.id_event = $1`, [id]);
        const values = [id];
        let countParams = 1;
        if (firstName) {
            query += ` AND u.first_name = $${++countParams}`;
            values.push(firstName);
            countParams++;
        }
        if (lastName) {
            query += ` AND u.last_name = $${++countParams}`;
            values.push(lastName);
            countParams++;
        }
        if (username) {
            query += ` AND u.username = $${++countParams}`;
            values.push(username);
            countParams++;
        }
        if (attended !== null) {
            query += ` AND ee.attended = $${++countParams}`;
            values.push(attended);
            countParams++;
        }
        if (rating) {
            query += ` AND ee.rating = $${++countParams}`;
            values.push(rating);
            countParams++;
        }
        
        try {
            const result = await client.query(query, values);
            const rows = result.rows;
            const response = {
                collection: rows,
                pagination: {
                    limit: 15,
                    offset: 0,
                    nextPage: null,
                    total: rows.length
                }
            };
            console.log(response);
            return response;
        }
        catch (error) {
            console.error(error);
            return null;
        }
        finally {
            client.release();
        }
    }

    getByIdAsync = async (id) => {
        const query = `
          SELECT 
            e.id, e.name, e.description, e.startdate,
            l.name as locations, 
            p.name as provinces
          FROM  events  e
          JOIN locations l ON e.id_location = l.id
          JOIN provinces p ON l.id_province = p.id
          WHERE e.id=${id}
        `;
        const values = [id];
        console.log(id);
        try {
          const { rows } = await pool.query(query, values); 
          return rows[0];
         
        } catch (error) {
          console.error('Error al obtener el evento:', error);
          throw error;
        }
      }
//8
    createEvent = async (eventData) => {
        const { name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location, userId } = eventData;
        const client = await pool.connect();
        try {
            const res = await client.query(
                'INSERT INTO events (name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location, userId]
            );
            return res.rows[0];
        } finally {
            client.release();
        }
    };
    updateEvent = async (eventData) => {
        const { name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location} = eventData;
        const client = await pool.connect();
        try {
            const res = await client.query(
                'UPDATE events SET name = $1, description = $2, max_assistance = $3, max_capacity = $4, price = $5, duration_in_minutes = $6, id_event_location = $7 WHERE id = $8 RETURNING *',
                [name, description, max_assistance, max_capacity, price, duration_in_minutes, id_event_location, id]
            );
            return res.rows[0];
        } finally {
            client.release();
        }
    };
    deleteEvent = async (id) => {
        const client = await pool.connect();
        try {
            await client.query('DELETE FROM events WHERE id = $1', [id]);
        } finally {
            client.release();
        }
    };
    async enrollAsync(id, userId) {
        const client = await this.pool.connect();
        try {
            const response = await client.query(
                `SELECT COUNT(*) AS enrolled, e.max_assistance
                FROM events_enrollments ee
                INNER JOIN events e ON ee.id_event = e.id
                WHERE ee.id_user = $1 AND ee.id_event = $2
                GROUP BY e.max_assistance`,
                [userId, id]
            );
            if (response.rowCount > 0) {
                if (response.rows[0].enrolled >= response.rows[0].max_assistance) {
                    return false;
                }
            }
        }
        catch (error) {
            console.error(error);
            return false;
        }
        try {
            await client.query(
                `INSERT INTO events_enrollments (id_user, id_event, registration_date_time)
                VALUES ($1, $2, now())`,
                [userId, id]
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async unenrollAsync(id, userId) {
        const client = await this.pool.connect();
        let response;
        try {
            response = await client.query(
                `SELECT COUNT(*) AS enrolled, e.start_date
                FROM events_enrollments
                INNER JOIN events e ON events_enrollments.id_event = e.id
                WHERE id_user = $1 AND id_event = $2
                GROUP BY e.start_date`,
                [userId, id]
            );
            if (response.rowCount === 0) {
                return 404;
            }
        }
        catch (error) {
            console.error(error);
            return 404;
        }
        if (new Date() > response.rows[0].start_date) {
            return 400;
        }
        try {
            await client.query(
                `DELETE FROM events_enrollments WHERE id_user = $1 AND id_event = $2`,
                [userId, id]
            );
            return 200;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    async rateEventRepo (eventId, userId, rating, observations) {
        const client = await pool.connect();
        try {
            // Verificar si el usuario está registrado al evento
            const enrollmentRes = await client.query('SELECT * FROM event_enrollments WHERE id_user = $1 AND id_event = $2', [userId, eventId]);
            if (enrollmentRes.rows.length === 0) {
                return { status: 400, message: 'El usuario no está registrado al evento.' };
            }
    
            const eventRes = await client.query('SELECT * FROM events WHERE id = $1', [eventId]);
            const event = eventRes.rows[0];
            if (!event) {
                return { status: 404, message: 'Evento no encontrado.' };
            }
            const currentTime = new Date();
            const eventEndDate = new Date(event.start_date);
    
            if (rating < 1 || rating > 10) {
                return { status: 400, message: 'El rating debe estar entre 1 y 10 (inclusive).' };
            }
            if (eventEndDate >= currentTime) {
                return { status: 400, message: 'El evento no ha finalizado aún.' };
            }
            const numericRating = Number(rating);
            const updateQuery = 'UPDATE event_enrollments SET rating = $1, observations = $2 WHERE id_event = $3 AND id_user = $4';
            const updateValues = [numericRating, observations, eventId, userId];
            const updateRes = await client.query(updateQuery, updateValues);
    
            if (updateRes.rowCount === 0) {
                return { status: 500, message: 'Error al actualizar el rating.' };
            }
            const postUpdateRes = await client.query('SELECT rating, observations FROM event_enrollments WHERE id_event = $1 AND id_user = $2', [eventId, userId]);
    
            if (postUpdateRes.rows[0].rating !== numericRating) {
                return { status: 500, message: 'El rating no se actualizó correctamente en la base de datos.' };
            }
    
            return { message: 'Evento rankeado correctamente.' };
        } finally {
            client.release();
        } 
    };
}
