module.exports = (req) => {

	return new function () {

		const _this = this;

		const base_url = req.config.base_url;

		const table = {

			title: 'tb_website_config',

			page: 'tb_page',

			content: 'tb_content',

			analysisCenter: 'tb_analysis_center',

			shareholder: 'tb_shareholder',

			careers: 'tb_careers',

			workplace: 'tb_config_workplace',

			faq: 'tb_faq',

			tags: 'tb_tags',

			contentTags: 'tb_object_tags',

			edu: 'tb_edu'
		}

		_this.getCompany = async () => {

			let sql = "SELECT * FROM " + table.title + " WHERE id = $1 AND language_id = $1";

			return await req.module.asyncQuery(sql, [req.language_id]);
		}

		_this.getPage = async (link) => {

			let sql = "SELECT  code , maker_date "

			sql += ", (CASE WHEN title_seo != '' THEN title_seo ELSE name END)  as name";

			sql += ", (CASE WHEN description != '' THEN description ELSE '' END)  as description";

			sql += ", (CASE WHEN detail !='' THEN detail ELSE '' END)  as detail"

			sql += ", (CASE WHEN images!='' THEN CONCAT('" + base_url + "', images) ELSE '' END)  as images";

			sql += " FROM " + table.page + " WHERE link = $1 AND language_id = $2";

			return await req.module.asyncQuery(sql, [link, req.language_id]);

		}

		_this.getContent = async (link) => {

			let sql = "SELECT id, date, maker_date, IF( title != '', title, name ) AS name,";

			sql += " (CASE WHEN images!='' THEN CONCAT('" + base_url + "',images) ELSE '' END)  as images ";

			sql += " FROM " + table.content + " WHERE link = $1 AND language_id = $2";

			return await req.module.asyncQuery(sql, [link, req.language_id]);
		}

		_this.getObjectTags = async (objectId) => {

			let sql = "SELECT IF( t2.title != '', t2.title, t2.name ) AS name FROM " + table.contentTags + " AS t1 ";

			sql += " LEFT JOIN  " + table.tags + " AS t2 ON t1.tags_id = t2.id ";

			sql += " WHERE t1.object_id = $1 ";

			return await req.module.asyncQuery(sql, objectId);

		}

		_this.getTags = async (link) => {

			let sql = " SELECT IF( title != '', title, name ) AS name,  code, description ";

			sql += " FROM " + table.tags + " WHERE link = $1 ";

			return await req.module.asyncQuery(sql, [link]);

		}
	}
}