ALTER TABLE flights
    ADD COLUMN IF NOT EXISTS origin_airport_id UUID NULL REFERENCES airports(id),
    ADD COLUMN IF NOT EXISTS destination_airport_id UUID NULL REFERENCES airports(id);

ALTER TABLE airports
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

INSERT INTO airports (id, name, iata, icao, country_code, lat, lon, created_at)
VALUES
    (gen_random_uuid(), 'Aeroparque Jorge Newbery', 'AEP', 'SABE', 'AR', -34.5592, -58.4156, now()),
    (gen_random_uuid(), 'Aeropuerto Internacional de Ezeiza', 'EZE', 'SAEZ', 'AR', -34.8222, -58.5358, now()),
    (gen_random_uuid(), 'Aeropuerto Internacional de Córdoba', 'COR', 'SACO', 'AR', -31.3164, -64.2083, now()),
    (gen_random_uuid(), 'Aeropuerto Internacional de Mendoza', 'MDZ', 'SAME', 'AR', -32.8317, -68.7931, now()),
    (gen_random_uuid(), 'Aeropuerto Internacional de Bariloche', 'BRC', 'SAZS', 'AR', -41.1511, -71.1575, now())
    ON CONFLICT (id) DO NOTHING;