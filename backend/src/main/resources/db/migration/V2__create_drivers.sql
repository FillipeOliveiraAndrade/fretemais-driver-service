CREATE TABLE drivers (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    vehicle_types TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para busca e filtros
CREATE INDEX idx_drivers_name ON drivers (name);
CREATE INDEX idx_drivers_email ON drivers (email);
CREATE INDEX idx_drivers_phone ON drivers (phone);
CREATE INDEX idx_drivers_city ON drivers (city);
CREATE INDEX idx_drivers_state ON drivers (state);

-- Índice GIN para array de tipos de veículo
CREATE INDEX idx_drivers_vehicle_types ON drivers USING GIN (vehicle_types);

CREATE OR REPLACE FUNCTION array_overlap(text[], text[])
RETURNS boolean
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT $1 && $2;
$$;
