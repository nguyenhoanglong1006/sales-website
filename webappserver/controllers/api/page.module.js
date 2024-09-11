module.exports = (req) => {

    return new function () {

        const _this = this;

        const table = {

            page: 'tb_page',

            content: 'tb_content',

            analysisCenter: 'tb_analysis_center',

            configIndustry: 'tb_config_industry',

            configCompany: 'tb_config_company',

            configStock: 'tb_config_stock',

            shareholder: 'tb_shareholder',

            library: 'tb_library',

            tags: 'tb_tags',

            objectTags: 'tb_object_tags',

            edu: 'tb_edu',

            slide: 'tb_slide',
        }

        _this.getPage = async (link) => {

            let url = req.config.base_url;

            let sql = "SELECT t1.id, t1.link, t1.type,t1.code, t1.detail , t1.type_builder , t1.position, t1.builder, t1.info, t1.page_id, t2.id as child_id ";

            sql += " , CASE WHEN (t1.title IS NOT NULL AND t1.title != '') THEN t1.title ELSE t1.name END as name ";

            sql += " , (CASE WHEN t1.images!='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images ";

            sql += " , (CASE WHEN t1.background!='' THEN CONCAT('" + url + "',t1.background) ELSE '' END) AS background ";

            sql += " , CASE WHEN (t1.list_library IS NOT NULL AND T1.list_library::text != '{}') THEN t1.list_library ELSE '[]' END list_library ";

            sql += " FROM " + table.page + " AS t1 ";

            sql += " LEFT JOIN " + table.content + " AS t2 ON t1.id = t2.page_id ";

            sql += " WHERE t1.status = 1 AND t1.language_id = $1 AND t1.link = $2 ";
            
            return await req.module.asyncQuery(sql, [req.language_id, link]);

        }

        _this.getPageGroup = async (parent_id, parent_link, level) => {
            
            let url = req.config.base_url;

            let sql = "SELECT id, name, code,  CONCAT( CAST($1 AS text), '/', link) AS href, link,  $2 AS level, ";

            sql += " (CASE WHEN images!='' THEN CONCAT('" + url + "',images) ELSE '' END) AS images";

            sql += "  FROM " + table.page;

            sql += " WHERE status = 1 AND page_id = $3 AND language_id = $4 ORDER BY orders ASC ";
            
            return await req.module.asyncQuery(sql, [parent_link, level, parent_id, req.language_id]);

        }


        _this.getInfoPage = async (link) => {

            let sql = "SELECT code, name, detail FROM " + table.page + " WHERE link = $1 AND language_id = $2 AND status = 1";

            return await req.module.asyncQuery(sql, [link, req.language_id]);
        }

        _this.getListPage = async (typeTable, code, page_id, limit, length, start, end) => {
            
            let url = req.config.base_url;

            let value = [];

            let sql = "SELECT t1.name";

            if (typeTable != 2 && typeTable != 4 && typeTable != 7) {

                sql += ", (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(CASE WHEN t4.link !='' THEN CONCAT(t4.link,'/') ELSE '' END, t3.link,'/',t1.link) ELSE t1.link END) AS link ";
            }

            switch (+typeTable) {
                case 2:
                    sql += " FROM " + table.page + " AS t1 ";
                    break;

                case 4:
                    sql += " ,  t1.file, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t1.link) ELSE t1.link END) AS link , t1.date, (CASE WHEN t1.images !='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images, t2.name AS parent_name, t1.page_id, t1.description, t1.author, t1.views ";
                    sql += " FROM " + table.content + " AS t1 ";
                    break;

            }

            if (typeTable != 2) {

                sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

                sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id";

                sql += " LEFT JOIN " + table.page + " AS t4 ON t3.page_id = t4.id";

            }

            sql += " WHERE t1.status = 1 ";

            if (page_id > 0 && typeTable != 2) {

                value.push(+page_id);

                sql += " AND t1.page_id = $1 ";

            }
            value.push(+req.language_id);

            sql += " AND t1.language_id = $2 ";

            if (typeTable == 2) {

                sql += " ORDER BY t1.maker_date DESC ";

            } else {
                if (code != 'AnnualReport') {

                    if (start != '' && end != '') {

                        value.push(start, end);

                        sql += " AND t1.date BETWEEN to_date( $3 , 'YYYY-MM-DD') AND to_date( $4 , 'YYYY-MM-DD')  ORDER BY t1.date DESC, t1.id ASC ";
                    }
                } else {
                    sql += " ORDER BY t1.date DESC, t1.id ASC"
                }
            }

            value.push(+limit);

            if (length > 0) {

                value.push(+length);

                sql += " LIMIT $5 ";

            } else {

                sql += " LIMIT $5 ";
            }

            return await req.module.asyncQuery(sql, value);
        }

        _this.getCategoryLibrary = async (list_library) => {

            let sql = "SELECT id, name, link, description FROM " + table.page;

            sql += " WHERE type = 5 AND page_id = 0 AND language_id = $1 ";

            sql += " AND id IN ( $2 )  AND status = 1";

            sql += " ORDER BY orders ASC";

            return await req.module.asyncQuery(sql, [req.language_id, list_library]);
        }

        _this.getGroupLibrary = async (id) => {

            let sql = "SELECT id, name FROM " + table.page;

            sql += " WHERE type = 5 AND language_id = $1 ";

            sql += " AND page_id = $2 AND status = 1";

            return await req.module.asyncQuery(sql, [req.language_id, id]);
        }

        _this.getListLibrary = async (id) => {
            
            let url = req.config.base_url;

            let sql = "SELECT id, name, ";

            sql += " (CASE WHEN images!='' THEN CONCAT('" + url + "', images) ELSE '' END) AS images";

            sql += " FROM " + table.library + " WHERE page_id = $1  AND status = 1";

            return await req.module.asyncQuery(sql, [id]);
        }

        _this.getCountListPage = async (typeTable, code, page_id, keywords, start, end, companyId, industryId, stockId) => {

            let value = [];

            let sql = "SELECT count(id) as count_list ";

            switch (+typeTable) {
                case 2:
                    sql += " FROM " + table.page;
                    break;

                case 4:
                    sql += " FROM " + table.content;
                    break;

            }

            sql += " WHERE status = 1 ";

            if (page_id > 0) {

                value.push(+page_id);

                sql += " AND page_id = $1 ";

            }

            value.push(+req.language_id);

            sql += " AND language_id = $2 ";

            value.push(start); value.push(end);

            sql += " AND date BETWEEN to_date( $3 , 'YYYY-MM-DD') AND to_date( $4 , 'YYYY-MM-DD')";
;
            return await req.module.asyncQuery(sql, value);
        }

        _this.getDetailPage = async (typeTable, link) => {
            
            let sql;

            let url = req.config.base_url;

            if (+typeTable == 2) {

                sql = "SELECT CASE WHEN (t1.title IS NOT NULL AND t1.title != '') THEN t1.title ELSE t1.name END name, t1.detail, t1.keywords, t2.name as parent_name, t2.code,t1.id AS page_id, ";

                sql += " (CASE WHEN t3.link !='' THEN CONCAT(t3.link,'/',t2.link) ELSE t2.link END) AS link, t1.position, t1.builder ";

                sql += " FROM " + table.page + " AS t1 ";

                sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

                sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id";

                sql += " WHERE t1.status = 1 AND t1.link = $1 AND t1.language_id = $2 ";

            } else {

                sql = "SELECT t1.id, t1.name, t1.date, t1.detail, t1.author, t1.page_id, t2.name as parent_name, t2.code, t1.position, t1.builder,";

                sql += " (CASE WHEN t3.link !='' THEN CONCAT(CASE WHEN t4.link !='' THEN CONCAT(t4.link,'/') ELSE '' END,t3.link,'/',t2.link) ELSE t2.link END) AS link ";

                switch (+typeTable) {

                    case 4:
                        sql += " ,(CASE WHEN t1.file !='' THEN t1.file ELSE '' END) as file  ";
                        sql += " FROM " + table.content + " AS t1 ";
                        break;

                    case 7:
                        sql += " ,(CASE WHEN t1.file !='' THEN t1.file ELSE '' END) as file  ";
                        sql += " FROM " + table.analysisCenter + " AS t1 ";
                        break;

                    case 8:
                        sql += " ,(CASE WHEN t1.file !='' THEN t1.file ELSE '' END) as file  ";
                        sql += " FROM " + table.shareholder + " AS t1 ";
                        break;

                    case 12:
                        sql += " FROM " + table.edu + " AS t1 ";
                        break;
                }

                sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

                sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id";

                sql += " LEFT JOIN " + table.page + " AS t4 ON t3.page_id = t4.id";

                sql += " WHERE t1.status = 1 AND t1.link = $1 AND t1.language_id = $2 ";

            }

            return await req.module.asyncQuery(sql, [link, req.language_id]);
        }

        _this.getOtherList = async (typeTable, page_id, link) => {

            let value = [page_id];

            let sql = "SELECT t1.id, t1.name ";

            if (typeTable != 2 && typeTable != 4 && typeTable != 7) {

                sql += ", t1.date , (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(CASE WHEN t4.link !='' THEN CONCAT(t4.link,'/') ELSE '' END,t3.link,'/',t2.link,'/',t1.link) ELSE t1.link END) AS link ";

            } else {

                sql += ", t1.link, t1.detail";
            }

            switch (+typeTable) {
                case 2:
                    sql += " FROM " + table.page + " AS t1 ";
                    break;

                case 4:
                    sql += " , t1.date , (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link FROM " + table.content + " AS t1 ";
                    break;

                case 7:
                    sql += ", (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link FROM " + table.analysisCenter + " AS t1 ";
                    break;

                case 8:
                    sql += " FROM " + table.shareholder + " AS t1 ";
                    break;
            }

            if (typeTable != 2) {

                value.push(link); value.push(+req.language_id);

                sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

                sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id";

                sql += " LEFT JOIN " + table.page + " AS t4 ON t3.page_id = t4.id";

                sql += " WHERE t1.status = 1 AND t1.page_id = $1 AND t1.link <> $2 AND t1.language_id = $3 ORDER BY t1.date DESC LIMIT 5";

            } else {

                value.push(+req.language_id);

                sql += " WHERE t1.status = 1 AND  t1.page_id = $1 AND t1.language_id = $3 ";

                sql += " ORDER BY t1.orders ASC";
            }

            return await req.module.asyncQuery(sql, value);
        }

        _this.getIndustry = async () => {

            let sql = "SELECT id, code, name FROM " + table.configIndustry;

            sql += " WHERE status = 1 AND language_id = $1 ";

            return await req.module.asyncQuery(sql, [req.language_id]);
        }

        _this.getCompany = async () => {

            let sql = "SELECT id,code,floor,name FROM " + table.configCompany;

            sql += " WHERE status = 1 AND language_id = $1 ";

            return await req.module.asyncQuery(sql, [req.language_id]);
        }

        _this.getStock = async () => {

            let sql = "SELECT id, code  FROM " + table.configStock;

            sql += " WHERE status = 1 ";

            return await req.module.asyncQuery(sql);
        }


        _this.getValueFilter = async (typeTable, page_id, keywords, start, end, companyId, industryId, stockId, limit, length) => {

            let url = req.config.base_url;

            let value = [];

            let sql = "SELECT t1.name, t1.date, ";

            if (+typeTable != 4 && +typeTable != 7) {

                sql += " (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t2.link,'/',t1.link) ELSE t1.link END) AS link ";

            }

            switch (+typeTable) {
                case 2:
                    sql += " FROM " + table.page + " AS t1 ";
                    break;

                case 4:
                    sql += " (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link , t1.date, (CASE WHEN t1.images !='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images, t2.name AS parent_name ";
                    sql += " FROM " + table.content + " AS t1 ";
                    break;

                case 7:
                    sql += " t1.detail as description, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link  , (CASE WHEN t1.images !='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images  ";
                    sql += " FROM " + table.analysisCenter + " AS t1 ";
                    break;

                case 8:
                    sql += " ,t1.detail as description , (CASE WHEN t1.images !='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images FROM " + table.shareholder + " AS t1 ";
                    break;

                case 12:
                    sql += ", t1.detail as description ,t1.date, (CASE WHEN t1.images !='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images ";
                    sql += " FROM " + table.edu + " AS t1 ";
                    break;
            }

            sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

            sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id";

            sql += " WHERE t1.status = 1 ";

            if (+page_id > 0) {

                value.push(+page_id);

                sql += " AND t1.page_id = $1 ";

            }

            value.push(+req.language_id);

            sql += " AND t1.language_id = $2 ";

            if (companyId != 0) {

                value.push(companyId);

                sql += " AND t1.company_id = $3 ";


            }
            if (industryId != 0) {

                value.push(+industryId);

                sql += " AND t1.industry_id = $4 ";
            }

            if (stockId != 0) {

                value.push(+stockId);

                sql += " AND t1.stock_id = $5 ";
            }

            if (keywords != '') {

                keywords = '%' + keywords + '%'; value.push(keywords);

                sql += " AND t1.name LIKE $6 ";
            }

            if (start != null && end != null) {

                value.push(start); value.push(end);

                sql += " AND DATE_FORMAT(t1.date, '%Y-%m-%d') BETWEEN DATE_FORMAT( $7 , '%Y-%m-%d') AND DATE_FORMAT( $8 , '%Y-%m-%d')";
            }

            value.push(+limit);

            if (+typeTable == 2) {

                sql += " ORDER BY t1.maker_date DESC ";

            } else {

                sql += " ORDER BY t1.date, t1.id DESC ";

            }

            if (length > 0) {

                value.push(+length);

                sql += " LIMIT $9 OFFSET $10 ";

            } else {

                sql += " LIMIT $9 ";
            }

            return await req.module.asyncQuery(sql, value);
        }

        _this.getObjectTags = async (objectId) => {

            let sql = "SELECT t2.name, t2.link FROM " + table.objectTags + " AS t1";

            sql += " LEFT JOIN " + table.tags + " AS t2 ON t1.tags_id = t2.id ";

            sql += " WHERE t2.status = 1 AND t1.object_id = $1 AND t2.language_id = $2 ";

            return await req.module.asyncQuery(sql, [objectId, req.language_id]);
        }

        _this.getPageTags = async (link) => {

            let sql = "SELECT id, name  FROM " + table.tags + "  WHERE status = 1 AND link = $1 AND language_id = $2 ";

            return await req.module.asyncQuery(sql, [link, req.language_id]);
        }

        _this.getListPageTags = async (tagsId, start) => {

            let url = req.config.base_url;

            let value = [tagsId, req.language_id, tagsId, req.language_id];

            sql = `SELECT t1.* FROM (

            SELECT  t1.id , t1.name, t1.detail as description, t1.date, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link,

            (CASE WHEN t1.images !='' THEN CONCAT('`+ url + `',t1.images) ELSE '' END) AS images

            FROM tb_content AS t1

            LEFT JOIN tb_page AS t2 ON t1.page_id = t2.id

            LEFT JOIN tb_page AS t3 ON t2.page_id = t3.id

            LEFT JOIN tb_object_tags AS t4 ON t4.object_id = t1.id

            WHERE t1.status = 1 AND t4.tags_id = $1 AND t1.language_id = $2

            UNION ALL

            SELECT t1.id , t1.name, t1.detail as description, t1.date, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link,

            (CASE WHEN t2.images !='' AND t1.images IS NULL THEN CONCAT( IF(t1.images IS NULL,'`+ url + `','` + url + `'),t2.images)

            WHEN  t1.images != '' THEN CONCAT('`+ url + `',t1.images) ELSE '' END) AS images

            FROM tb_analysis_center AS t1

            LEFT JOIN tb_page AS t2 ON t1.page_id = t2.id

            LEFT JOIN tb_page AS t3 ON t2.page_id = t3.id

            LEFT JOIN tb_object_tags AS t4 ON t4.object_id = t1.id

            WHERE t1.status = 1 AND t4.tags_id = $1 AND t1.language_id = $2) AS t1 ORDER BY t1.date, t1.id DESC `

            if (start > 0) {

                value.push(+start);

                sql += ` LIMIT 12 OFFSET $3 `;

            } else {

                sql += ` LIMIT 12`;
            }

            return await req.module.asyncQuery(sql, value);
        }


        _this.getCountListPageTags = async (tagsId) => {

            let sql = ` SELECT SUM(t1.count_list) as count_list FROM (

            SELECT count(t1.id) as count_list 

            FROM tb_object_tags AS t1

            LEFT JOIN tb_content AS t2 ON t1.object_id = t2.id

            WHERE t1.status = 1 AND t1.tags_id = $1 AND t2.language_id = $2

            UNION ALL

            SELECT count(t1.id) as count_list 

            FROM tb_object_tags AS t1

            LEFT JOIN tb_analysis_center AS t2 ON t1.object_id = t2.id

            WHERE t1.status = 1 AND t1.tags_id = $1 AND t2.language_id = $2   ) AS t1  `;

            return await req.module.asyncQuery(sql, [tagsId, req.language_id, tagsId, req.language_id]);
        }

        _this.getPostViewMore = async (tagsId) => {

            let sql = `SELECT t1.* FROM (

            SELECT t1.name, t1.description, t1.date, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link

            FROM tb_content AS t1

            LEFT JOIN tb_page AS t2 ON t1.page_id = t2.id

            LEFT JOIN tb_page AS t3 ON t2.page_id = t3.id

            LEFT JOIN tb_object_tags AS t4 ON t4.object_id = t1.id

            WHERE t1.status = 1 AND t4.tags_id = $1 AND t1.language_id = $2

            UNION ALL

            SELECT t1.name, t1.description, t1.date, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link

            FROM tb_analysis_center AS t1

            LEFT JOIN tb_page AS t2 ON t1.page_id = t2.id

            LEFT JOIN tb_page AS t3 ON t2.page_id = t3.id

            LEFT JOIN tb_object_tags AS t4 ON t4.object_id = t1.id

            WHERE t1.status = 1 AND t4.tags_id = $1 AND t1.language_id = $2) AS t1 ORDER BY t1.date DESC LIMIT 5`;

            return await req.module.asyncQuery(sql, [tagsId, req.language_id, tagsId, req.language_id]);
        }


        _this.updateViews = async (type, link) => {
            let sql;

            switch (+type) {
                case 4:
                    sql = "UPDATE " + table.content + " SET views = views + 1 WHERE link= $1 AND language_id = $2 ";
                    break;

                case 7:
                    sql = "UPDATE " + table.analysisCenter + " SET views = views + 1 WHERE link= $1 AND language_id = $2 ";
                    break;

            }

            return await req.module.asyncQuery(sql, [link, req.language_id]);
        }

        _this.checkTypePage = async (link) => {

            let sql = "SELECT id FROM " + table.page + " WHERE type = 11 AND link= $1 AND language_id = $2 ";

            return await req.module.asyncQuery(sql, [link, req.language_id]);
        }

        _this.checkPageLink = async (link) => {

            let sql = `SELECT t2.link as link 

            FROM tb_page AS t1 

            LEFT JOIN tb_page AS t2 ON t1.id = t2.page_id 

            WHERE  t1.link = $1 AND t1.page_id > 0 AND t2.id > 0 AND t1.language_id = $2 AND t2.status = 1 ORDER BY t2.orders ASC  limit 1`;

            return await req.module.asyncQuery(sql, [link, req.language_id]);

        };

        // _this.getBannerByLink = async (link) => {
        //     const url = req.config.base_url;

        //     const sql = `
        //         SELECT name, link, title, 
                
        //         (CASE WHEN images != '' THEN CONCAT('${url}', images) ELSE '' END) images
                
        //         FROM ${table.slide} 

        //         WHERE JSON_CONTAINS(page_id, 

        //             (SELECT CONCAT('', id, '') 
                    
        //             FROM ${table.page} 

        //             WHERE link = $1 AND language_id = $2)

        //         ) = 1 AND type = 2 AND status = 1
        //     `;

        //     return await req.module.asyncQuery(sql, [link, req.language_id]);
        // };
    }
}