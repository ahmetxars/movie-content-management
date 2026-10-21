CREATE TABLE IF NOT EXISTS categories
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,

    CONSTRAINT uk_categories_name
    UNIQUE (name)
    );


CREATE TABLE IF NOT EXISTS content_categories
(
    content_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    CONSTRAINT pk_content_categories
    PRIMARY KEY (content_id, category_id),

    CONSTRAINT fk_content_categories_content
    FOREIGN KEY (content_id)
    REFERENCES contents (id)
    ON DELETE CASCADE,

    CONSTRAINT fk_content_categories_category
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE CASCADE
    );