CREATE OR REPLACE FUNCTION points_for_level(p_level INTEGER)
    RETURNS INTEGER
    LANGUAGE plpgsql
AS
$function$
BEGIN
    RETURN (p_level - 1.0) / 2.0 * (55.0 + ((p_level - 2.0) * 10.0 + 55.0)) + 100.0;
END
$function$;
