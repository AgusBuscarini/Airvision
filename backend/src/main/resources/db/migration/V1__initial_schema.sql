CREATE TYPE role_t AS ENUM ('ADMIN', 'USER');
CREATE TYPE airline_t AS ENUM ('GLOBAL', 'PRIVATE');
CREATE TYPE source_t AS ENUM ('API', 'SIMULATED');

CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       name TEXT NOT NULL,
                       email TEXT UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       role role_t NOT NULL DEFAULT 'USER',
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE airlines (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          name TEXT NOT NULL,
                          type airline_t NOT NULL,
                          owner_user_id UUID NULL REFERENCES users(id),
                          iata TEXT NULL,
                          icao TEXT NULL,
                          country_code TEXT NULL,
                          active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE airports (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          name TEXT NOT NULL,
                          city TEXT NOT NULL,
                          country TEXT NOT NULL,
                          iata TEXT UNIQUE,
                          icao TEXT UNIQUE,
                          lat DOUBLE PRECISION,
                          lon DOUBLE PRECISION
);

CREATE TABLE flight_routes (
                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                               airline_id UUID REFERENCES airlines(id),
                               origin_airport_id UUID REFERENCES airports(id),
                               destination_airport_id UUID REFERENCES airports(id),
                               distance_km DOUBLE PRECISION,
                               estimated_duration_min INTEGER,
                               created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE flights (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         source source_t NOT NULL,
                         icao24 TEXT NOT NULL,
                         callsign TEXT NULL,
                         airline_id UUID NULL REFERENCES airlines(id),
                         route_id UUID NULL REFERENCES flight_routes(id),
                         origin_country TEXT NULL,
                         lat DOUBLE PRECISION NULL,
                         lon DOUBLE PRECISION NULL,
                         baro_altitude DOUBLE PRECISION NULL,
                         velocity DOUBLE PRECISION NULL,
                         true_track DOUBLE PRECISION NULL,
                         vertical_rate DOUBLE PRECISION NULL,
                         on_ground BOOLEAN NULL,
                         last_contact_ts TIMESTAMPTZ NULL,
                         updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                         owner_user_id UUID NULL REFERENCES users(id)
);
