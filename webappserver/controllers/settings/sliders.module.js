module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			slide: 'tb_slide'

		}

		_this.getList = async () => {

			let url = req.config.base_url;

			let sql = "SELECT t1.id , t1.name , t1.maker_date, t1.status, t1.images, t1.orders ";

			sql += " , (CASE WHEN t1.images!='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images ";

			sql += " FROM " + table.slide + " AS t1 ";

			// sql += " WHERE t1.language_id = $1 ";

			sql += " ORDER BY t1.maker_date DESC";
			

			return await req.module.asyncQuery(sql);
		}

		_this.getRow = async (id) => {

			let sql = "SELECT t1.* FROM " + table.slide + " AS t1  WHERE t1.id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updateStatus = async (status, id) => {

			let sql = "UPDATE " + table.slide + " SET status = $1 WHERE id = $2 ";

			return await req.module.asyncQuery(sql, [status, id]);
		}

		_this.checkProcess = async (name, id) => {

			let value = [name, req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.slide + " WHERE name = $1 AND language_id = $2 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $3";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.slide + " SET $" : "UPDATE " + table.slide + " SET $ WHERE id= $ ";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.slide + " WHERE id= $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.slide + " WHERE code = $1 ";

			return await req.module.asyncQuery(sql, [code]);
		}
	}
}