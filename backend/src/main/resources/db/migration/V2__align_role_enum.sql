DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_t') THEN
CREATE TYPE role_t AS ENUM ('ADMIN', 'USER');
END IF;
END $$;

UPDATE users SET role = 'USER'::role_t WHERE role IS NULL;

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'USER'::role_t;
