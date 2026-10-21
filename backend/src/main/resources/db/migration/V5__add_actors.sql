CREATE TABLE IF NOT EXISTS actors
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    birth_date DATE,
    biography VARCHAR(3000),
    photo VARCHAR(1000)
    );

CREATE TABLE IF NOT EXISTS content_actors
(
    content_id BIGINT NOT NULL,
    actor_id BIGINT NOT NULL,

    CONSTRAINT pk_content_actors
    PRIMARY KEY (content_id, actor_id),

    CONSTRAINT fk_content_actors_content
    FOREIGN KEY (content_id)
    REFERENCES contents (id)
    ON DELETE CASCADE,

    CONSTRAINT fk_content_actors_actor
    FOREIGN KEY (actor_id)
    REFERENCES actors (id)
    ON DELETE CASCADE
    );