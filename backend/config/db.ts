// Legacy pg query helper — kept for backward compatibility.
// New code should use prisma from ./prisma.ts instead.
import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
