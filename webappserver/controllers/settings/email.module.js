module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			config: "tb_config_mail"

		}

		_this.getRow = async () => {

			let sql = "SELECT * FROM " + table.config + " WHERE id = 1";

			return await req.module.asyncQuery(sql);
		}

		_this.process = async (data) => {

			let sql = "UPDATE " + table.config + " SET $ WHERE id = 1";

			return await req.module.asyncQuery(sql, [data]);
		}
	}
}