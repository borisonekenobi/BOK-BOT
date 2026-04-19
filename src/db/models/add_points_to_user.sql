CREATE OR REPLACE FUNCTION add_points_to_user(
    p_server_id NUMERIC(19, 0),
    p_user_id NUMERIC(19, 0),
    p_date TIMESTAMPTZ)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$function$
DECLARE
    v_level                 INTEGER;
    v_points                INTEGER;
    v_random                INTEGER;
    v_points_for_next_level INTEGER;
BEGIN
    SELECT level, points
    INTO v_level, v_points
    FROM server_users
    WHERE user_id = p_user_id
      AND server_id = p_server_id;

    SELECT FLOOR(random() * 11) + 15 INTO v_random;

    SELECT points_for_level(v_level + 1) INTO v_points_for_next_level;

    IF (v_points + v_random >= v_points_for_next_level) THEN
        UPDATE server_users
        SET points             = v_points + v_random - v_points_for_next_level,
            level              = v_level + 1,
            last_earned_points = p_date
        WHERE user_id = p_user_id
          AND server_id = p_server_id;

        v_level = v_level + 1;
    ELSE
        UPDATE server_users
        SET points             = v_points + v_random,
            last_earned_points = p_date
        WHERE user_id = p_user_id
          AND server_id = p_server_id;
    END IF;

    RETURN v_level;
END
$function$;
