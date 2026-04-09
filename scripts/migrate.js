#!/usr/bin/env node

/**
 * Simple database migration runner
 * Usage: node scripts/migrate.js [up|down|status]
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function createMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getExecutedMigrations() {
  const result = await pool.query('SELECT filename FROM migrations ORDER BY executed_at');
  return result.rows.map(row => row.filename);
}

async function runMigration(filename) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filepath, 'utf-8');
  
  console.log(`Running migration: ${filename}`);
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query(
      'INSERT INTO migrations (filename) VALUES ($1)',
      [filename]
    );
    await client.query('COMMIT');
    console.log(`✓ Migration completed: ${filename}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`✗ Migration failed: ${filename}`);
    console.error(error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function migrate() {
  await createMigrationsTable();
  
  const executedMigrations = await getExecutedMigrations();
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  let runCount = 0;
  
  for (const file of files) {
    if (!executedMigrations.includes(file)) {
      await runMigration(file);
      runCount++;
    } else {
      console.log(`✓ Already executed: ${file}`);
    }
  }
  
  if (runCount === 0) {
    console.log('No pending migrations');
  } else {
    console.log(`\nCompleted ${runCount} migration(s)`);
  }
}

async function status() {
  await createMigrationsTable();
  
  const executedMigrations = await getExecutedMigrations();
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  console.log('\nMigration Status:');
  console.log('=================');
  
  for (const file of files) {
    const isExecuted = executedMigrations.includes(file);
    const status = isExecuted ? '✓ EXECUTED' : '○ PENDING';
    console.log(`${status}  ${file}`);
  }
}

async function main() {
  const command = process.argv[2] || 'up';
  
  try {
    switch (command) {
      case 'up':
        await migrate();
        break;
      case 'status':
        await status();
        break;
      default:
        console.log('Usage: node scripts/migrate.js [up|status]');
        process.exit(1);
    }
  } catch (error) {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
