CREATE TABLE users ( 
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP DEFAULT NULL,
    registration_time TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT CHECK (status IN ('active', 'blocked')) NOT NULL
);