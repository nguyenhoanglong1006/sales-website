module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			language: 'tb_language',

			setting: 'tb_setting',
		}

		_this.getList = async () => {

			let url = req.config.base_url + 'public/iconlang/';

			let sql = "SELECT id, code, name, defaults, status, ";

			sql += " (CASE WHEN icon!='' THEN CONCAT('" + url + "', icon) ELSE '' END) AS icon ";

			sql += " FROM " + table.language;

			return await req.module.asyncQuery(sql);

		}

		_this.getLanguageSetting = async () => {

			let url = req.config.base_url + 'public/settings/';

			let sql = "SELECT id, text_key, title, type, ";

			sql += " (CASE WHEN type = 2 THEN CONCAT('" + url + "', value) ELSE value END) AS value ";

			sql += " FROM " + table.setting + " WHERE status = 1 AND language_id = $1 ";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}
	}
}