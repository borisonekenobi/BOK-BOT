CREATE TABLE IF NOT EXISTS server_log_channels
(
    server_id  NUMERIC(19, 0) NOT NULL,
    channel_id NUMERIC(19, 0) NOT NULL,

    CONSTRAINT pk_server_log_channel PRIMARY KEY (server_id, channel_id),
    CONSTRAINT fk_server_log_channel_server FOREIGN KEY (server_id) REFERENCES servers (id),
    CONSTRAINT fk_server_log_channel_channel FOREIGN KEY (channel_id) REFERENCES channels (id)
);
