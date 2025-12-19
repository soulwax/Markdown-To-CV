#!/usr/bin/env node
/**
 * Test database connection
 * Usage: pnpm tsx scripts/test-db-connection.ts
 */
import postgres from 'postgres';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file if it exists
config({ path: resolve(process.cwd(), '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set in environment variables');
	console.log('\nPlease set DATABASE_URL in your .env file or environment');
	process.exit(1);
}

// Extract hostname from DATABASE_URL for display (without credentials)
const urlMatch = DATABASE_URL.match(/@([^:]+):(\d+)\//);
const hostname = urlMatch ? urlMatch[1] : 'unknown';
const port = urlMatch ? urlMatch[2] : 'unknown';

console.log(`🔍 Testing connection to: ${hostname}:${port}`);
console.log('⏳ Attempting to connect...\n');

const client = postgres(DATABASE_URL, {
	max: 1,
	connect_timeout: 10
});

async function testConnection() {
	try {
		const result = await client`SELECT version() as version, current_database() as database, current_user as user`;
		console.log('✅ Connection successful!\n');
		console.log('Database Information:');
		console.log(`  Database: ${result[0].database}`);
		console.log(`  User: ${result[0].user}`);
		console.log(`  PostgreSQL Version: ${result[0].version.split(' ')[0]} ${result[0].version.split(' ')[1]}\n`);
		
		// Test if tables exist
		const tables = await client`
			SELECT table_name 
			FROM information_schema.tables 
			WHERE table_schema = 'public'
			ORDER BY table_name
		`;
		
		if (tables.length > 0) {
			console.log('📊 Existing tables:');
			tables.forEach((table: { table_name: string }) => {
				console.log(`  - ${table.table_name}`);
			});
		} else {
			console.log('📊 No tables found in public schema');
		}
		
		await client.end();
		process.exit(0);
	} catch (error) {
		console.error('❌ Connection failed!\n');
		
		if (error instanceof Error) {
			if (error.message.includes('ENOTFOUND')) {
				console.error('DNS Resolution Error:');
				console.error(`  The hostname "${hostname}" could not be resolved.`);
				console.error('\nPossible causes:');
				console.error('  1. Network connectivity issue');
				console.error('  2. VPN not connected (if required)');
				console.error('  3. Incorrect DATABASE_URL');
				console.error('  4. Database server is down or unreachable');
				console.error('\nTroubleshooting:');
				console.error(`  - Try: ping ${hostname}`);
				console.error(`  - Verify DATABASE_URL in .env file`);
				console.error('  - Check if VPN/network access is required');
			} else if (error.message.includes('timeout')) {
				console.error('Connection Timeout:');
				console.error('  The database server did not respond in time.');
				console.error('\nPossible causes:');
				console.error('  1. Firewall blocking connection');
				console.error('  2. Database server is overloaded');
				console.error('  3. Network latency issues');
			} else if (error.message.includes('password') || error.message.includes('authentication')) {
				console.error('Authentication Error:');
				console.error('  Invalid credentials or user permissions.');
				console.error('\nPlease check:');
				console.error('  - Database username and password in DATABASE_URL');
				console.error('  - User permissions on the database');
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

testConnection();
