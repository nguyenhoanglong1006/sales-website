module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			tags: 'tb_tags',

			content: 'tb_content',

			contentTags: 'tb_object_tags',

			page: 'tb_page'

		}

		_this.getList = async () => {

			let sql = "SELECT t1.id , t1.name , t1.maker_date, t1.status ";

			sql += " FROM " + table.tags + " AS t1  WHERE t1.language_id = $1 ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql, [+req.language_id]);
		}

		_this.getRow = async (id) => {

			let value = [id];

			let sql = "SELECT t1.* FROM " + table.tags + " AS t1 WHERE t1.id = $1";

			return await req.module.asyncQuery(sql, value);
		}

		_this.updateStatus = async (status, id) => {

			let sql = "UPDATE " + table.tags + " SET status = $1 WHERE id = $2";

			return await req.module.asyncQuery(sql, [status, id]);
		}

		_this.checkProcess = async (link, id) => {

			let value = [link, +req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.tags + " WHERE link = $1 AND language_id = $2";

			if (id > 0) {

				value.push(id); sql += " AND id != $3";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.checkExitPage = async (link, id) => {

			let value = [link, +req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.page + " WHERE link = $1 AND page_id = 0 AND language_id = $2";

			if (id > 0) {

				value.push(id); sql += " AND id != $3";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.tags + " SET $" : "UPDATE " + table.tags + " SET $ WHERE id = $";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.checkRemove = async (tags_id) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.contentTags + " WHERE tags_id= $1";

			return await req.module.asyncQuery(sql, [tags_id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.tags + " WHERE  id = $1";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.tags + " WHERE code = $1";

			return await req.module.asyncQuery(sql, [code]);
		}

	}
}