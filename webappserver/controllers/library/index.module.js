module.exports = (req)=>{

	return new function(){

		const _this = this;

		const table = {

			library: 'tb_library'
		}

		_this.getList = async () => {

			let url = req.config.base_url;

			let sql = "SELECT id, parent_id, ";

			sql += " (CASE WHEN images!='' THEN CONCAT('" + url + "', images) ELSE '' END) AS images, ";

			sql += " name, value, description, orders, maker_date, type, status ";

			sql += " FROM " + table.library;

			sql += " WHERE language_id = ? ORDER BY maker_date DESC";

			return await req.module.asyncQuery(sql,[req.language_id ]);

		}

		_this.getRow = async (id, code, language_id) => {

			let value = [+language_id == 1 ? 2 : 1];

			let sql = "SELECT t1.*, t3.id as group_id FROM "+ table.library +" AS t1 " ;

			sql += "LEFT JOIN tb_page AS t2 ON t1.page_id = t2.id ";

			sql +=" LEFT JOIN (SELECT id, code FROM tb_page WHERE language_id = ? ) AS t3 ON t2.code = t3.code " ;
 
			if(!code || code.length == 0){

				value.push(id);

				sql += " WHERE  t1.id = ? ";

			}else{

				value.push(language_id); value.push(code); 

				sql += " WHERE t1.language_id = ? AND t1.code = ? ";

			}

			return await req.module.asyncQuery(sql,value);

		}

	
		_this.checkProcess = async (name, id, language_id) => {

			let value = [name, language_id > 0 ? language_id : req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.library + " WHERE name= ? AND language_id = ? ";

			if (id > 0) {

				value.push(id);

				sql += " AND id != ? ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async(data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.library + " SET ?" : "UPDATE " + table.library + " SET ? WHERE id = ? ";

			return await req.module.asyncQuery(sql, [data, id]);

		}

		_this.remove = async(id) => {

			let sql = "DELETE FROM " + table.library + " WHERE id = ? ";

			return await req.module.asyncQuery(sql, [id]);

		}

		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.library + " WHERE code = ? ";

			return await req.module.asyncQuery(sql, code);
		}
	}
}