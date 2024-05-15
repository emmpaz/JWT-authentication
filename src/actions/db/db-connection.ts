
import { QueryResult } from "pg";


const {Pool} = require('pg');
/**
 * creating a connection pool with postgres
 */
const pool = new Pool({
    host: process.env.NEXT_PUBLIC_MULTIPASS_IP,
    port: 5432,
    database: 'auth_table',
    user: 'postgres',
    password: process.env.NEXT_PUBLIC_POSTGRES_PASSWORD
});

export async function query(text: string, params?: any[]): Promise<QueryResult> {
    return pool.query(text, params);
  }