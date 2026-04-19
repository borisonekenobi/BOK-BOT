CREATE TABLE IF NOT EXISTS server_bot_roles
(
    server_id NUMERIC(19, 0) NOT NULL,
    role_id   NUMERIC(19, 0) NOT NULL,

    CONSTRAINT pk_server_bot_role PRIMARY KEY (server_id, role_id),
    CONSTRAINT fk_server_bot_role_server FOREIGN KEY (server_id) REFERENCES servers (id),
    CONSTRAINT fk_server_bot_role_role FOREIGN KEY (role_id) REFERENCES roles (id)
);
