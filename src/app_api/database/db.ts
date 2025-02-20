import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not defined');
}

const sql = postgres(databaseUrl);

// Set the schema if needed
sql`SET search_path TO public`;

export default sql;