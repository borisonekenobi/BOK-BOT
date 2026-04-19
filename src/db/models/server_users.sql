CREATE TABLE IF NOT EXISTS server_users
(
    server_id          NUMERIC(19, 0) NOT NULL,
    user_id            NUMERIC(19, 0) NOT NULL,
    level              INTEGER        NOT NULL DEFAULT 0,
    points             INTEGER        NOT NULL DEFAULT 0,
    last_earned_points TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_server_user PRIMARY KEY (server_id, user_id),
    CONSTRAINT fk_server_user_server FOREIGN KEY (server_id) REFERENCES servers (id),
    CONSTRAINT fk_server_user_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT ck_server_user_level CHECK (level >= 0),
    CONSTRAINT ck_server_user_points CHECK (points >= 0)
);
