module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			content: 'tb_content',

			page: 'tb_page',

			objectTags: 'tb_object_tags',

			tags: 'tb_tags'
		}

		_this.getList = async () => {

			let sql = "SELECT t1.id , t1.name , t1.pin, t1.page_id, t1.status, t1.images ,t1.date, t1.maker_date, t2.name AS name_group ";

			sql += " FROM " + table.content + " AS t1  ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.language_id = $1 ";

			sql += " ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}

		_this.getRow = async (id) => {

			let sql = `SELECT * FROM ${table.content} WHERE id = $1`;

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updateStatus = async (id) => {

			const sql = `UPDATE ${table.content}  SET status = (select CASE WHEN t1.status = 1 THEN 0 ELSE 1 END from ${table.content} AS t1 where t1.id = $1) WHERE id = $1 `;

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updatePin = async ( id) => {

			const sql = `UPDATE ${table.content}  SET pin = (select CASE WHEN t1.pin = 1 THEN 0 ELSE 1 END from ${table.content} AS t1 where t1.id = $1) WHERE id = $1 `;

			return await req.module.asyncQuery(sql, [id]);
		};


		_this.checkProcess = async (link, id) => {

			let value = [link, +req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.content + " WHERE link = $1 AND language_id = $2 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $3 ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.content + " SET $" : "UPDATE " + table.content + " SET $ WHERE id= $";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.content + " WHERE id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.removeContentTags = async (contentId) => {

			let sql = "DELETE FROM " + table.objectTags + " WHERE object_id = $1 ";

			return await req.module.asyncQuery(sql, [contentId]);
		}

		_this.processContentTags = async (data) => {

			let sql = "INSERT INTO " + table.objectTags + " SET $";

			return await req.module.asyncQuery(sql, data);
		}

		_this.getContentTags = async (contentId) => {

			let sql = "SELECT t1.object_id, t1.tags_id as id, t2.name FROM " + table.objectTags + " AS t1 ";

			sql += " LEFT JOIN " + table.tags + " AS t2 ON t1.tags_id = t2.id WHERE t1.object_id = $1  ";

			return await req.module.asyncQuery(sql, [contentId]);
		}

		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.content + " WHERE code = $1 ";

			return await req.module.asyncQuery(sql, [code]);
		}

		_this.checkExistsFile = async (id) => {

			let sql = "SELECT file FROM " + table.content + " WHERE id = $ ";

			return await req.module.asyncQuery(sql, id);
		}
	}
}