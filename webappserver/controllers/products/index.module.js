module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			product: 'tb_product',

			page: 'tb_page',

			objectTags: 'tb_object_tags',

			tags: 'tb_tags'
		}

		_this.getList = async () => {

			let url = req.config.base_url;
			
			let sql = "SELECT t1.id , t1.name , t1.page_id, t1.status,  t1.maker_date, t2.name AS product_name_group ";

			sql += " , (CASE WHEN t1.images !='' THEN CONCAT('" + url + "public/products/',  t1.images) ELSE '' END) AS images ";

			sql += " FROM " + table.product + " AS t1  ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.language_id = $1 ";

			sql += " ORDER BY t1.maker_date DESC";

			return await req.module.asyncQuery(sql, [+req.language_id]);
		}

		_this.getRow = async (id) => {

			let sql = `SELECT * FROM ${table.product} WHERE id = $1`;

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updateStatus = async (id) => {

			const sql = `UPDATE ${table.product}  SET status = (select CASE WHEN t1.status = 1 THEN 0 ELSE 1 END from ${table.product} AS t1 where t1.id = $1) WHERE id = $1 `;

			return await req.module.asyncQuery(sql, [id]);
		}

		// _this.updatePin = async ( id) => {

		// 	const sql = `UPDATE ${table.product}  SET pin = (select CASE WHEN t1.pin = 1 THEN 0 ELSE 1 END from ${table.product} AS t1 where t1.id = $1) WHERE id = $1 `;

		// 	return await req.module.asyncQuery(sql, [id]);
		// };


		_this.checkProcess = async (link, id) => {

			let value = [link, +req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.product + " WHERE link = $1 AND language_id = $2 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $3 ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.product + " SET $" : "UPDATE " + table.product + " SET $ WHERE id= $";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.product + " WHERE id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.removeproductTags = async (productId) => {

			let sql = "DELETE FROM " + table.objectTags + " WHERE object_id = $1 ";

			return await req.module.asyncQuery(sql, [productId]);
		}

		_this.processproductTags = async (data) => {

			let sql = "INSERT INTO " + table.objectTags + " SET $";

			return await req.module.asyncQuery(sql, data);
		}

		_this.getproductTags = async (productId) => {

			let sql = "SELECT t1.object_id, t1.tags_id as id, t2.name FROM " + table.objectTags + " AS t1 ";

			sql += " LEFT JOIN " + table.tags + " AS t2 ON t1.tags_id = t2.id WHERE t1.object_id = $1  ";

			return await req.module.asyncQuery(sql, [productId]);
		}

		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.product + " WHERE code = $1 ";

			return await req.module.asyncQuery(sql, [code]);
		}

		_this.checkExistsFile = async (id) => {

			let sql = "SELECT file FROM " + table.product + " WHERE id = $ ";

			return await req.module.asyncQuery(sql, id);
		}
	}
}