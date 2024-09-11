module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			address: 'tb_config_address',

		}

		_this.getList = async () => {

			let sql = "SELECT t1.id , t1.name , t1.is_delete, t1.maker_date, t1.status, t1.pin ";

			sql += " FROM " + table.address + " AS t1 WHERE t1.language_id = $1 ";

			return await req.module.asyncQuery(sql, [req.language_id]);
		}

		_this.getRow = async (id) => {

			let sql = "SELECT * FROM " + table.address+ " WHERE id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updateStatus = async (id) => {

			const sql = `UPDATE ${table.address}  SET status = (select CASE WHEN t1.status = 1 THEN 0 ELSE 1 END from ${table.address} AS t1 where t1.id = $1) WHERE id = $1 `;

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkProcess = async (name, id) => {

			let value = [name, req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.address + " WHERE name = $1 ";

			sql += " AND language_id = $2 ";

			if (id > 0) {

				value.push(id);

				sql += " AND id != $3";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.address + " SET $" : "UPDATE " + table.address + " SET $ WHERE id = $ ";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.address + " WHERE id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}
	}
}