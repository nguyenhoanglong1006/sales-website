module.exports = (req) => {

	return new function() {

		const _this = this;

		const table = {

			faq: 'tb_faq'
		}

		_this.getList = async () => {

			let sql = "SELECT id , name , pin, status , orders, maker_date ";

			sql += " FROM " + table.faq;

			sql += " WHERE language_id = ? ";

			sql += " ORDER BY maker_date DESC";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}

		_this.getRow = async (id, code, language_id) => {

			let value = [];

			let sql = "SELECT * FROM " + table.faq;

			if(!code || code.length == 0){

				value.push(id);

				sql += " WHERE  id = ? ";

			}else{

				value.push(language_id); value.push(code); 

				sql += " WHERE language_id = ? AND code = ? ";

			}
			
			return await req.module.asyncQuery(sql,value);
		}

		_this.updatePin = async (id) => {

			let sql = "UPDATE " + table.faq + " SET pin = !pin WHERE id = ? ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkProcess = async (link, id, language_id) => {

			let value = [link, language_id > 0 ? language_id : req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.faq + " WHERE link = ? ";

			sql += " AND language_id = ? ";

			if (id > 0) {

				value.push(id);

				sql += " AND id != ? ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.faq + " SET ?" : "UPDATE " + table.faq + " SET ? WHERE id= ? ";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.faq + " WHERE id= ? ";

			return await req.module.asyncQuery(sql, [id]);
		}
		
		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.faq + " WHERE code = ? ";

			return await req.module.asyncQuery(sql, code);
		}
	}
}