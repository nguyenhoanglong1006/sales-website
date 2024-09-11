module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			redirect: 'tb_redirect',

		}

		_this.getList = async () => {

			let sql = "SELECT t1.id , t1.link , t1.status_code, t1.maker_date";

			sql += " FROM " + table.redirect + " AS t1  ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql);
		}

		_this.getRow = async (id) => {

			let sql = "SELECT * FROM " + table.redirect + " WHERE id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkProcess = async (link, id) => {

			let value = [link];

			let sql = "SELECT COUNT(id) AS count FROM " + table.redirect + " WHERE link = $1 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $2";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.redirect + " SET $" : "UPDATE " + table.redirect + " SET $ WHERE id= $ "

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.redirect + " WHERE  id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}
	}
}