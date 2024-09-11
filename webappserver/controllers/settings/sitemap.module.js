module.exports = (req) => {
    return new (function () {
        const _this = this;

        _this.getXMLProduct = async (domain, language) => {
            domain = language == 1 ? domain : domain + "en/";

            let sql = `
            SELECT (
                WITH RECURSIVE link_all (id, link, page_id, p_level) 
                AS (
                    SELECT id, link, page_id, 1 AS p_level
                    FROM tb_page
                    WHERE id = tb_pg.id AND language_id = 1
                    UNION ALL
                    SELECT ct.id, ct.link, ct.page_id , p_level + 1
                    FROM tb_page AS ct
                    INNER JOIN link_all AS la ON ct.id = la.page_id  AND ct.language_id = ${language}
                    WHERE ct.language_id = 1
                ) 
                SELECT CONCAT( '${domain}', string_agg(link , '/' ORDER BY p_level DESC)) AS link 
                FROM link_all
            ) AS link 
            FROM tb_page AS tb_pg 
            WHERE tb_pg.status = 1 AND tb_pg.type != 1  AND tb_pg.language_id =  ${language}
            `;

            return await req.module.asyncQuery(sql);
        };


        _this.getXMLPage = async (domain, language) => {
            domain = language == 1 ? domain : domain + "en/";

            let sql = `
            SELECT (
                WITH RECURSIVE link_all (id, link, page_id, p_level) 
                AS (
                    SELECT id, link, page_id, 1 AS p_level
                    FROM tb_page
                    WHERE id = tb_pg.id AND language_id = 1
                    UNION ALL
                    SELECT ct.id, ct.link, ct.page_id , p_level + 1
                    FROM tb_page AS ct
                    INNER JOIN link_all AS la ON ct.id = la.page_id  AND ct.language_id = ${language}
                    WHERE ct.language_id = 1
                ) 
                SELECT CONCAT( '${domain}', string_agg(link , '/' ORDER BY p_level DESC)) AS link 
                FROM link_all
            ) AS link 
            FROM tb_page AS tb_pg 
            WHERE tb_pg.status = 1 AND tb_pg.type != 1  AND tb_pg.language_id =  ${language}
            `;

            return await req.module.asyncQuery(sql);
        };

        _this.getXMLPost = async (domain, language) => {
            domain = language == 1 ? domain : domain + "en/";

            let sql = `SELECT
                tb_ct.name, 
                tb_ct.language_id, 
                (CASE WHEN tb_ct.title != '' THEN tb_ct.title ELSE tb_ct.name END) AS title, 
                (
                    WITH RECURSIVE link_all (id, link, page_id, p_level) AS
                    (
                        SELECT id, link, a.page_id::bigint, 1 AS p_level
                        FROM tb_content as a
                        WHERE id = tb_ct.id AND language_id = ${language}
                        UNION ALL
                        SELECT ct.id, ct.link, ct.page_id , p_level + 1 
                        FROM tb_page AS ct
                        INNER JOIN link_all AS la ON ct.id = la.page_id AND ct.language_id = ${language}
                    ) 
                    SELECT CONCAT('${domain}', string_agg(link , '/' ORDER BY p_level DESC)) AS link 
                    FROM link_all 
                    WHERE p_level != 2 
                ) AS link 
                FROM tb_content AS tb_ct 
                WHERE tb_ct.status = 1 AND tb_ct.language_id = ${language}`;
            return await req.module.asyncQuery(sql);
        };
    })();
};
