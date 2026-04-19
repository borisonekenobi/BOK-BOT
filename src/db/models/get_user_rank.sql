CREATE OR REPLACE FUNCTION get_user_rank(
    server_id NUMERIC(19, 0),
    member_id NUMERIC(19, 0))
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$function$
BEGIN
    RETURN (SELECT rank
            FROM (SELECT *, RANK() OVER (ORDER BY level DESC, points DESC, last_earned_points) AS rank
                  FROM (SELECT *
                        FROM server_users
                        WHERE server_users.server_id = $1
                        ORDER BY level DESC, points DESC, last_earned_points) AS users) AS user_info
            WHERE user_id = $2);
END
$function$;
