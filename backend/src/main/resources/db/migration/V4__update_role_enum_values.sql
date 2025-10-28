DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        WHERE t.typname = 'role_t' AND e.enumlabel = 'USER'
    ) THEN
ALTER TYPE role_t RENAME VALUE 'USER' TO 'USER_FREE';
END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        WHERE t.typname = 'role_t' AND e.enumlabel = 'USER_PREMIUM'
    ) THEN
ALTER TYPE role_t ADD VALUE 'USER_PREMIUM' AFTER 'USER_FREE';
END IF;
END $$;

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'USER_FREE';