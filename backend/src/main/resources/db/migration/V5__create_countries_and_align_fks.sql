-- 1. Crear la tabla 'countries'
-- Esta tabla es referenciada por las entidades Airline, Airport y Flight.
CREATE TABLE IF NOT EXISTS countries (
                                         code VARCHAR(2) PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
    );

-- 2. Poblar (seed) la tabla 'countries' con datos iniciales.
INSERT INTO countries (code, name) VALUES
                                       ('AR', 'Argentina'),
                                       ('US', 'United States'),
                                       ('ES', 'Spain'),
                                       ('BR', 'Brazil'),
                                       ('CL', 'Chile'),
                                       ('UY', 'Uruguay'),
                                       ('CO', 'Colombia'),
                                       ('PE', 'Peru'),
                                       ('MX', 'Mexico')
-- ON CONFLICT: Si el script se corre de nuevo, no fallará por claves duplicadas.
    ON CONFLICT (code) DO NOTHING;


-- 3. Actualizar tabla 'airlines' para alinear con la entidad Airline.java
-- La entidad espera una FK en 'country_code'.
-- V1 la definió como TEXT.
ALTER TABLE airlines
-- Cambiar el tipo de 'country_code' de TEXT a VARCHAR(2) para que coincida con countries.code
ALTER COLUMN country_code TYPE VARCHAR(2) USING (country_code::VARCHAR(2)),

    -- Agregar la restricción de clave foránea
    ADD CONSTRAINT fk_airline_country
    FOREIGN KEY (country_code) REFERENCES countries(code);


-- 4. Actualizar tabla 'airports' para alinear con la entidad Airport.java
-- La entidad espera 'country_code' y no tiene 'city' ni 'country'.
-- V1 definió 'city' y 'country' (como TEXT) pero no 'country_code'.

-- Agregar la nueva columna para la clave foránea
ALTER TABLE airports
    ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);

-- Agregar la restricción de clave foránea
ALTER TABLE airports
    ADD CONSTRAINT fk_airport_country
        FOREIGN KEY (country_code) REFERENCES countries(code);

-- Eliminar las columnas obsoletas que no están en la entidad Airport.java
ALTER TABLE airports
DROP COLUMN IF EXISTS city,
    DROP COLUMN IF EXISTS country;


-- 5. Actualizar tabla 'flights' para alinear con la entidad Flight.java
-- La entidad espera 'country_code' y no 'origin_country'.
-- V1 definió 'origin_country' (como TEXT).

-- Agregar la nueva columna para la clave foránea
ALTER TABLE flights
    ADD COLUMN IF NOT EXISTS country_code VARCHAR(2);

-- Agregar la restricción de clave foránea
ALTER TABLE flights
    ADD CONSTRAINT fk_flight_country
        FOREIGN KEY (country_code) REFERENCES countries(code);

-- Eliminar la columna obsoleta 'origin_country'
ALTER TABLE flights
DROP COLUMN IF EXISTS origin_country;