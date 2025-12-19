#!/usr/bin/env node
/**
 * Grant database permissions for schema creation
 * Usage: pnpm tsx scripts/grant-db-permissions.ts
 */
import { config } from 'dotenv';
import { resolve } from 'path';
import postgres from 'postgres';

// Load .env file if it exists
config({ path: resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set in environment variables');
	process.exit(1);
}

const client = postgres(DATABASE_URL, {
	max: 1,
	connect_timeout: 10
});

async function grantPermissions() {
	let currentUser = 'your_username';
	
	try {
		console.log('🔐 Attempting to grant database permissions...\n');

		// Get current user
		const userResult = await client`SELECT current_user as user, current_database() as database`;
		currentUser = userResult[0].user;
		const currentDatabase = userResult[0].database;

		console.log(`Current user: ${currentUser}`);
		console.log(`Current database: ${currentDatabase}\n`);

		// Try to grant usage and create on public schema
		console.log('Granting USAGE on public schema...');
		await client.unsafe(`GRANT USAGE ON SCHEMA public TO "${currentUser}"`);
		console.log('✅ USAGE granted\n');

		console.log('Granting CREATE on public schema...');
		await client.unsafe(`GRANT CREATE ON SCHEMA public TO "${currentUser}"`);
		console.log('✅ CREATE granted\n');

		// Grant all privileges on all tables in public schema (for future tables)
		console.log('Granting ALL privileges on public schema...');
		await client.unsafe(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${currentUser}"`);
		console.log('✅ Table privileges granted\n');

		// Grant privileges on sequences (for auto-increment columns)
		console.log('Granting privileges on sequences...');
		await client.unsafe(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${currentUser}"`);
		console.log('✅ Sequence privileges granted\n');

		// Set default privileges for future tables
		console.log('Setting default privileges for future tables...');
		await client.unsafe(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${currentUser}"`);
		await client.unsafe(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${currentUser}"`);
		console.log('✅ Default privileges set\n');

		console.log('✅ All permissions granted successfully!\n');
		console.log('You can now run: pnpm run db:push\n');

		await client.end();
		process.exit(0);
	} catch (error) {
		console.error('❌ Failed to grant permissions!\n');

		if (error instanceof Error) {
			if (error.message.includes('permission denied') || error.message.includes('must be owner')) {
				console.error('Permission Error:');
				console.error('  Your database user does not have sufficient privileges.');
				console.error('  This is common with managed databases (like Aiven).\n');
				console.error('Solutions:');
				console.error('  1. Contact your database administrator to grant permissions');
				console.error('  2. Use a database user with CREATE privileges');
				console.error(`  3. Run the following SQL commands manually (replace '${currentUser}' if different):\n`);
				console.error(`     GRANT USAGE ON SCHEMA public TO "${currentUser}";`);
				console.error(`     GRANT CREATE ON SCHEMA public TO "${currentUser}";`);
				console.error(`     GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${currentUser}";`);
				console.error(`     GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${currentUser}";`);
				console.error(`     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${currentUser}";`);
				console.error(`     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO "${currentUser}";\n`);
				console.error(`  4. Or see scripts/grant-permissions.sql for a template\n`);
			} else {
				console.error('Error details:');
				console.error(`  ${error.message}`);
			}
		} else {
			console.error('Unknown error:', error);
		}

		await client.end();
		process.exit(1);
	}
}

grantPermissions();
