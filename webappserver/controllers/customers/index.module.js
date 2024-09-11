module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			customers: 'tb_customer'
		}

		_this.getList = async () => {

			let linkAvatar = req.config.base_url;

			let sql = "SELECT t1.id , t1.avatar,   t1.name , t1.phone, t1.email, t1.status, t1.sex, t1.maker_date, t1.is_delete ";

			sql += " , (CASE WHEN t1.avatar!='' THEN CONCAT('" + linkAvatar + "',t1.avatar) ELSE '' END) AS avatar ";

			sql += " FROM " + table.customers + " AS t1  ";

			sql += " ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql);

		}
		_this.getRow = async (id) => {

			let sql = "SELECT * FROM " + table.customers + " WHERE id =  $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.changePassword = async (password, token, id) => {

			let sql = "UPDATE " + table.customers + " SET password = $1 , token = $2 WHERE id = $3 ";

			return await req.module.asyncQuery(sql, [password, token, id]);
		}

		_this.checkProcessEmail = async (email, id) => {

			let value = [email];

			let sql = "SELECT COUNT(id) AS count FROM " + table.customers + " WHERE email = $1 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $2 ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.customers + " SET $" : "UPDATE " + table.customers + " SET $ WHERE id= $ ";


			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = " UPDATE  " + table.customers + " SET status = 0 WHERE status = 1 AND id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}
	}
}