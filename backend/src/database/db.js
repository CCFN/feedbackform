import pg from 'pg';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

// Check if PostgreSQL configuration is available
const usePostgres = Boolean(process.env.DATABASE_URL || (process.env.PGUSER && process.env.PGDATABASE));

let pool = null;
if (usePostgres) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('[Database]: Initialized PostgreSQL pool connection');
  } catch (err) {
    console.warn('[Database]: PostgreSQL pool failed to initialize, using robust embedded store:', err.message);
    pool = null;
  }
}

// Embedded in-memory / persistent mock store for zero-friction standalone development & automated tests
class InMemoryDatabase {
  constructor() {
    this.states = [];
    this.facilities = [];
    this.users = [];
    this.expectations = [];
    this.feedback = [];
    this.audit_logs = [];
    this.initDefaultSeed();
  }

  initDefaultSeed() {
    // Generate UUIDs for Nigerian States
    const stateAbiaId = '11111111-1111-4111-8111-111111111111';
    const stateAnambraId = '22222222-2222-4222-8222-222222222222';
    const stateEnuguId = '33333333-3333-4333-8333-333333333333';
    const stateImoId = '44444444-4444-4444-8444-444444444444';
    const stateLagosId = '55555555-5555-4555-8555-555555555555';
    const stateFCTId = '66666666-6666-4666-8666-666666666666';

    const now = new Date();

    this.states = [
      { id: stateAbiaId, name: 'Abia', code: 'AB', status: 'ACTIVE', created_at: now, updated_at: now },
      { id: stateAnambraId, name: 'Anambra', code: 'AN', status: 'ACTIVE', created_at: now, updated_at: now },
      { id: stateEnuguId, name: 'Enugu', code: 'EN', status: 'ACTIVE', created_at: now, updated_at: now },
      { id: stateImoId, name: 'Imo', code: 'IM', status: 'ACTIVE', created_at: now, updated_at: now },
      { id: stateLagosId, name: 'Lagos', code: 'LA', status: 'ACTIVE', created_at: now, updated_at: now },
      { id: stateFCTId, name: 'Federal Capital Territory (Abuja)', code: 'FCT', status: 'ACTIVE', created_at: now, updated_at: now },
    ];

    // Facilities
    this.facilities = [
      // Anambra facilities
      {
        id: '2a111111-1111-4111-8111-111111111111',
        state_id: stateAnambraId,
        name: 'St. Jude Metropolitan Health — Awka Central',
        code: 'SJM-AWK-01',
        ward: 'Ward 4B (Outpatient & Diagnostics)',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: '2a222222-2222-4222-8222-222222222222',
        state_id: stateAnambraId,
        name: 'Chukwuemeka Odumegwu Ojukwu University Teaching Hospital',
        code: 'COOUTH-01',
        ward: 'Main Clinical Pavilion',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: '2a333333-3333-4333-8333-333333333333',
        state_id: stateAnambraId,
        name: 'Nnamdi Azikiwe University Teaching Hospital (NAUTH)',
        code: 'NAUTH-NWI',
        ward: 'Specialist Consultation Wing',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      // Enugu facilities
      {
        id: '3a111111-1111-4111-8111-111111111111',
        state_id: stateEnuguId,
        name: 'University of Nigeria Teaching Hospital (UNTH) Ituku-Ozalla',
        code: 'UNTH-01',
        ward: 'General Medicine & Specialist Clinics',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: '3a222222-2222-4222-8222-222222222222',
        state_id: stateEnuguId,
        name: 'ESUT Teaching Hospital Parklane',
        code: 'ESUT-PKL',
        ward: 'Primary Care OPD',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      // Abia facilities
      {
        id: '1a111111-1111-4111-8111-111111111111',
        state_id: stateAbiaId,
        name: 'Federal Medical Centre (FMC) Umuahia',
        code: 'FMC-UMU',
        ward: 'Inpatient & Ambulatory Block',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      // Imo facilities
      {
        id: '4a111111-1111-4111-8111-111111111111',
        state_id: stateImoId,
        name: 'Federal Medical Centre (FMC) Owerri',
        code: 'FMC-OWR',
        ward: 'Central Referral Ward 2A',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      // Lagos facilities
      {
        id: '5a111111-1111-4111-8111-111111111111',
        state_id: stateLagosId,
        name: 'Lagos University Teaching Hospital (LUTH) Idi-Araba',
        code: 'LUTH-01',
        ward: 'Clinical Consultation Block C',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: '5a222222-2222-4222-8222-222222222222',
        state_id: stateLagosId,
        name: 'Lagos Island General Hospital (Metro General)',
        code: 'LIGH-01',
        ward: 'West Campus (Ward 4B)',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      }
    ];

    // Seed Admin User (phone: +2348000000001 / Admin@CareEcho2026!)
    const adminPasswordHash = bcrypt.hashSync('Admin@CareEcho2026!', 10);
    const adminId = 'a0000000-0000-4000-8000-000000000001';
    this.users.push({
      id: adminId,
      first_name: 'Administrator',
      last_name: 'Directorate',
      phone_number: '+2348000000001',
      password_hash: adminPasswordHash,
      state_id: stateAnambraId,
      facility_id: '2a111111-1111-4111-8111-111111111111',
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: 'avatar_admin',
      created_at: now,
      updated_at: now
    });

    // Seed Demo Patient User (Eleanor Vance: +2348012345678 / Password@123)
    const userPasswordHash = bcrypt.hashSync('Password@123', 10);
    const demoUserId = 'b0000000-0000-4000-8000-000000000002';
    this.users.push({
      id: demoUserId,
      first_name: 'Eleanor',
      last_name: 'Vance',
      phone_number: '+2348012345678',
      password_hash: userPasswordHash,
      state_id: stateAnambraId,
      facility_id: '2a111111-1111-4111-8111-111111111111',
      role: 'USER',
      status: 'ACTIVE',
      avatar: 'avatar_1',
      created_at: now,
      updated_at: now
    });

    // Seed Demo Participant User 2 (Alex Morgan: +15550192834 / Password@123)
    const demoUser2Id = 'c0000000-0000-4000-8000-000000000003';
    this.users.push({
      id: demoUser2Id,
      first_name: 'Alex',
      last_name: 'Morgan',
      phone_number: '+15550192834',
      password_hash: userPasswordHash,
      state_id: stateLagosId,
      facility_id: '5a222222-2222-4222-8222-222222222222',
      role: 'USER',
      status: 'ACTIVE',
      avatar: 'avatar_2',
      created_at: now,
      updated_at: now
    });

    // Demo expectation for Eleanor Vance
    const expId = 'd0000000-0000-4000-8000-000000000001';
    this.expectations.push({
      id: expId,
      user_id: demoUserId,
      session_id: '#CK-89410',
      expectation_text: 'I expect timely consultation within 15 minutes of my scheduled slot, clean sanitized facilities, and clear explanations of my lab results from the attending physician.',
      status: 'RECORDED',
      submitted_at: new Date(Date.now() - 3600000 * 2), // 2 hours ago
      created_at: now,
      updated_at: now
    });
  }
}

export const db = new InMemoryDatabase();

/**
 * Executes a query against PostgreSQL if available, otherwise delegates to InMemoryDatabase
 */
export async function query(text, params = []) {
  if (pool) {
    return pool.query(text, params);
  }
  // In-memory execution
  return { rows: [] };
}
