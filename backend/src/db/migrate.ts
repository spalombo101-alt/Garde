import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, testConnection } from './connect.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database');
    process.exit(1);
  }

  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

    // Split by semicolon and filter empty statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Running ${statements.length} SQL statements...`);

    for (const statement of statements) {
      await pool.query(statement);
      console.log('✓', statement.substring(0, 60).replace(/\n/g, ' ') + '...');
    }

    console.log('\n✓ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
