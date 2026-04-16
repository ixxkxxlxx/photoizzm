import Database from 'better-sqlite3';
import path from 'path';

// Use the existing sqlite database
const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
const db = new Database(dbPath);

export async function query(sql: string, params?: any[]) {
  try {
    // Basic implementation that handles both SELECT and INSERT/UPDATE
    // better-sqlite3 uses .prepare(sql).all(params) for SELECT 
    // and .prepare(sql).run(params) for others.
    // We'll use a simple heuristic to decide, or just use .all if results are expected.
    
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
    const stmt = db.prepare(sql);
    
    if (isSelect) {
      return stmt.all(params || []);
    } else {
      const result = stmt.run(params || []);
      return result;
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default db;