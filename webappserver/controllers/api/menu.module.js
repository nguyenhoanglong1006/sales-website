module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			configMenu: 'tb_config_menu',

			page: 'tb_page',

			language: 'tb_language'
		}

		_this.getRow = async (position) => {

			let sql = "SELECT container FROM " + table.configMenu + " WHERE position = $1 AND statu = 1 ";

			return await req.module.asyncQuery(sql, [position]);
		}

		_this.getMenu = async (position) => {

			let url = req.config.base_url;

			let sql = "SELECT t1.id , t1.name, t1.type, t1.page_id, t1.target_blank";

			sql += " ,(CASE WHEN t1.images !='' THEN CONCAT('" + url + "', t1.images) ELSE '' END) as images ";

			sql += " ,(CASE WHEN t1.icon !='' THEN CONCAT('" + url + "', t1.icon) ELSE '' END) as icon";

			sql += " ,(CASE WHEN t1.orders = 0 THEN t1.id ElSE t1.orders END) AS orderby";

			sql += " ,(CASE WHEN t1.type != 1 AND t3.link != '' THEN CONCAT((CASE WHEN language.code = 'vn' THEN '' ELSE language.code END), '/' , t3.link , '/', t1.link)";

			sql += " WHEN t1.type != 1 AND t2.link != '' THEN CONCAT((CASE WHEN language.code = 'vn' THEN '' ELSE language.code END), '/', t2.link, '/', t1.link)";

			sql += " WHEN t1.type != 1 AND t2.link IS NULL THEN CONCAT((CASE WHEN language.code = 'vn' THEN  ''ELSE language.code END) , '/' , t1.link) ";

			sql += " ElSE CONCAT(t1.link) END) AS href, t1.link  ";

			sql += " FROM " + table.page + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id ";

			sql += " LEFT JOIN " + table.language + " AS language ON t1.language_id = language.id ";

			sql += " WHERE t1.id::text::jsonb <@ (SELECT container FROM " + table.configMenu + " WHERE position = $1 AND status = 1)::jsonb "

			sql += " AND t1.status = 1 AND t1.language_id = $2 ORDER BY orderby ASC";

			return await req.module.asyncQuery(sql, [position, req.language_id]);

		}
	}
}