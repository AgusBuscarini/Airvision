DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'airline_t') THEN
CREATE TYPE airline_t AS ENUM ('GLOBAL', 'PRIVATE');
END IF;
END $$;

ALTER TABLE airlines
ALTER COLUMN type TYPE airline_t USING type::airline_t;

ALTER TABLE airlines ALTER COLUMN type SET DEFAULT 'GLOBAL'::airline_t;
UPDATE airlines SET type = 'GLOBAL'::airline_t WHERE type IS NULL;

DO $$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_t') THEN
CREATE TYPE source_t AS ENUM ('API', 'SIMULATED');
END IF;
END $$;

ALTER TABLE flights
ALTER COLUMN source TYPE source_t USING source::source_t;

ALTER TABLE flights ALTER COLUMN source SET DEFAULT 'API'::source_t;
UPDATE flights SET source = 'API'::source_t WHERE source IS NULL;

ANALYZE airlines;
ANALYZE flights;
