import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedPostgres() {
  if (!process.env.DATABASE_URL && !process.env.PGDATABASE) {
    console.log('[Seed]: No DATABASE_URL found. Application uses built-in resilient database with preloaded seed data automatically.');
    return;
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('[Seed]: Connected to PostgreSQL database');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('[Seed]: Applied schema migrations successfully');

    // Check if states exist
    const { rows: existingStates } = await client.query('SELECT id FROM states LIMIT 1');
    if (existingStates.length === 0) {
      // Insert Nigerian States
      const stateAnambra = await client.query(
        "INSERT INTO states (name, code, status) VALUES ('Anambra', 'AN', 'ACTIVE') RETURNING id"
      );
      const stateEnugu = await client.query(
        "INSERT INTO states (name, code, status) VALUES ('Enugu', 'EN', 'ACTIVE') RETURNING id"
      );
      const stateAbia = await client.query(
        "INSERT INTO states (name, code, status) VALUES ('Abia', 'AB', 'ACTIVE') RETURNING id"
      );
      const stateImo = await client.query(
        "INSERT INTO states (name, code, status) VALUES ('Imo', 'IM', 'ACTIVE') RETURNING id"
      );
      const stateLagos = await client.query(
        "INSERT INTO states (name, code, status) VALUES ('Lagos', 'LA', 'ACTIVE') RETURNING id"
      );

      // Insert Facilities
      await client.query(
        "INSERT INTO facilities (state_id, name, code, ward, status) VALUES ($1, $2, $3, $4, 'ACTIVE')",
        [stateAnambra.rows[0].id, 'St. Jude Metropolitan Health — Awka Central', 'SJM-AWK-01', 'Ward 4B (Outpatient & Diagnostics)']
      );
      await client.query(
        "INSERT INTO facilities (state_id, name, code, ward, status) VALUES ($1, $2, $3, $4, 'ACTIVE')",
        [stateAnambra.rows[0].id, 'Chukwuemeka Odumegwu Ojukwu University Teaching Hospital', 'COOUTH-01', 'Main Clinical Pavilion']
      );
      await client.query(
        "INSERT INTO facilities (state_id, name, code, ward, status) VALUES ($1, $2, $3, $4, 'ACTIVE')",
        [stateEnugu.rows[0].id, 'University of Nigeria Teaching Hospital (UNTH) Ituku-Ozalla', 'UNTH-01', 'General Medicine & Specialist Clinics']
      );
      await client.query(
        "INSERT INTO facilities (state_id, name, code, ward, status) VALUES ($1, $2, $3, $4, 'ACTIVE')",
        [stateLagos.rows[0].id, 'Lagos Island General Hospital (Metro General)', 'LIGH-01', 'West Campus (Ward 4B)']
      );

      // Insert Default Admin
      const adminHash = await bcrypt.hash('Admin@CareEcho2026!', 10);
      await client.query(
        "INSERT INTO users (first_name, last_name, phone_number, password_hash, role, status) VALUES ($1, $2, $3, $4, $5, $6)",
        ['Administrator', 'Directorate', '+2348000000001', adminHash, 'ADMIN', 'ACTIVE']
      );

      console.log('[Seed]: Seed data populated successfully in PostgreSQL');
    } else {
      console.log('[Seed]: Database already contains data. Skipping default seed.');
    }
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  } finally {
    await client.end();
  }
}

seedPostgres();
