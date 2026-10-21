CREATE TABLE IF NOT EXISTS contents
(
    id BIGSERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    year INTEGER,

    genre VARCHAR(255),

    rating DOUBLE PRECISION,

    plot VARCHAR(2000),

    poster VARCHAR(1000),

    director VARCHAR(255),

    created_at TIMESTAMP
    );


CREATE TABLE IF NOT EXISTS app_users
(
    id BIGSERIAL PRIMARY KEY,

    email VARCHAR(255) NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(255) NOT NULL,

    enabled BOOLEAN NOT NULL,

    created_at TIMESTAMP NOT NULL,

    CONSTRAINT uk_app_users_email
    UNIQUE (email)
    );