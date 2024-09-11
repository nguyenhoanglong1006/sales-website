-- FUNCTION: public.search_data(text)

DROP FUNCTION IF EXISTS public.search_data(text);

CREATE OR REPLACE FUNCTION public.search_data(
    p_search_term text)
    RETURNS TABLE(
        name character varying, 
        code character varying, 
        views integer, 
        price double precision, 
        price_sale double precision, 
        status integer, 
        link character varying, 
        href character varying, 
        images character varying, 
        percent integer,
        page_id integer
    ) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000
AS $BODY$
BEGIN
  RETURN QUERY EXECUTE
  -- Use the input parameter in the WHERE clause
  'SELECT 
        t1.name, 
        t1.code, 
        t1.views, 
        t1.price, 
        t1.price_sale , 
        t1.status, 
        t1.link, 
        t2.link as href, 
        t1.images, 
        t1.percent,
        t1.page_id
    FROM 
        public.tb_product t1
        LEFT JOIN public.tb_page t2 ON t1.page_id = t2.id
    WHERE 
        LOWER(TRANSLATE(
            t1.name, 
            ''áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ'', 
            ''aaaaaaaaaaaaaaaaadeeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy''
        )) ILIKE lower(''%' || replace(p_search_term, '''''''', '''''''''''') || '%'')
        OR lower(t1.code) LIKE lower(''%' || replace(p_search_term, '''''''', '''''''''''') || '%'')
    ORDER BY 
        t1.name
  ;';
END;
$BODY$;

ALTER FUNCTION public.search_data(text)
    OWNER TO postgres;
