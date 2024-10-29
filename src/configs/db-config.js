/*const config = {
    host : "localhost",
    database : "postgres",
    user : "postgres",
    password : "root" ,
    port : 5432
}
export default config;*/
import pg from 'pg';

const pool = new pg.Pool({
    host: 'localhost',
    database: 'postgres',
    user: 'postgres',
    password: 'root',
    port: 5432,
});

export default pool;
