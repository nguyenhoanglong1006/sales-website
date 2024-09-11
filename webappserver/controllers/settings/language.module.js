module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			language: 'tb_language',

			user: 'tb_user'
		}

		_this.getList = async () => {

			let sql = "SELECT t1.id , t1.name , t1.status, t1.maker_date, t1.defaults, t2.name AS account_name ";

			sql += " FROM " + table.language + " AS t1  ";

			sql += " LEFT JOIN  " + table.user + " AS t2 ON t1.maker_id = t2.id  ";

			return await req.module.asyncQuery(sql);
		}

		_this.updateStatus = async (status, id) => {

			let sql = "UPDATE " + table.language + " SET status = $1  WHERE id = $2 ";

			return await req.module.asyncQuery(sql, [status, id]);
		}
	}
}