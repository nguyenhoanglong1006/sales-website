module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			title: "tb_website_config"
		}

		_this.getRow = async () => {

			let sql = " SELECT id, name, logo, logo_white, shortcut, description, language_id FROM " + table.title + " where language_id = $1";

			return await req.module.asyncQuery(sql, [req.language_id]);
		}

		_this.process = async (data, id) => {

			let sql = " UPDATE " + table.title + " SET $ WHERE id = $";

			return await req.module.asyncQuery(sql, [data, id]);
		}
	}
}