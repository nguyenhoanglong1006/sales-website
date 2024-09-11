module.exports = (req) => {

	return new function() {

		const _this = this;

		const table = {

			careers: 'tb_careers',

			workplace: 'tb_config_workplace'

		}

		_this.getList = async () => {

			let sql = "SELECT t1.id , t1.name ,t1.deadline, t1.pin, t1.workplace_id, t1.status , t1.maker_date, t2.name AS workplace ";

			sql += " FROM " + table.careers + " AS t1  ";

			sql += " LEFT JOIN " + table.workplace + " AS t2 ON t1.workplace_id = t2.id ";

			sql += " WHERE t1.language_id = ? ";

			sql += " ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}

		_this.workplace = async () => {

			let sql = "SELECT t1.id, t1.name, t2.count, t1.orders ";

			sql += " FROM " + table.workplace + " AS t1  ";

			sql += " LEFT JOIN (SELECT COUNT(id) as count , workplace_id FROM " + table.careers + " GROUP BY workplace_id) as t2 On t1.id = t2.workplace_id";

			sql += " WHERE t1.status = 1 AND t1.language_id = ? ";

			sql += " ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}

		_this.getRow = async (id, code, language_id) => {

			let value = [+language_id == 1 ? 2 : 1];

			let sql = "SELECT t1.*, t3.id as group_id FROM " + table.careers + " AS t1 ";
			 
			sql +=" LEFT JOIN  " + table.workplace + " AS t2 ON t1.workplace_id = t2.id ";
			 
			sql +=" LEFT JOIN (SELECT id, code FROM " + table.workplace + " WHERE language_id = ? ) AS t3 ON t2.code = t3.code ";

			if(!code || code.length == 0){

				value.push(id);

				sql += " WHERE  t1.id = ? ";

			}else{

				value.push(language_id); value.push(code); 

				sql += " WHERE t1.language_id = ? AND t1.code = ? ";

			}
			
			return await req.module.asyncQuery(sql, value);
		}


		_this.updateStatus = async (id) => {

			let sql = "UPDATE " + table.careers + " SET status = !status WHERE id = ? ";

			return await req.module.asyncQuery(sql,[id]);
		}

		_this.updatePin = async (id) => {

			let sql = "UPDATE " + table.careers + " SET pin = !pin WHERE id = ?";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkProcess = async (link, workplace_id, id, language_id) => {

			let value = [link,workplace_id , language_id > 0 ? language_id : req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.careers + " WHERE link = ? AND workplace_id = ? ";

			sql += " AND language_id = ? ";

			if (id > 0) {

				value.push(id);

				sql += " AND id != ? ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.careers + " SET ?" : "UPDATE " + table.careers + " SET ? WHERE id= ? " ;

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.careers + " WHERE id= ? ";

			return await req.module.asyncQuery(sql, [id]);
		}


		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.careers + " WHERE code = ? ";

			return await req.module.asyncQuery(sql, code);
		}
	}
}