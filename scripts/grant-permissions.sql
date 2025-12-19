-- Grant database permissions for schema creation
-- Run this SQL script as a database administrator or superuser
-- 
-- Usage:
--   1. Connect to your database as an admin user
--   2. Replace 'your_username' with your actual database username
--   3. Run these commands

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO your_username;

-- Grant create privileges on public schema
GRANT CREATE ON SCHEMA public TO your_username;

-- Grant all privileges on existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;

-- Grant all privileges on existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO your_username;

-- Set default privileges for future sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO your_username;

-- Verify permissions (optional - run as your user)
-- SELECT has_schema_privilege('your_username', 'public', 'USAGE');
-- SELECT has_schema_privilege('your_username', 'public', 'CREATE');
