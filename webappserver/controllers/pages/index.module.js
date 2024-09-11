module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			page: 'tb_page',

			content: 'tb_content',

			orders: 'tb_orders',

			library: 'tb_library',

			analysisCenter: 'tb_analysis_center',

			shareholder: 'tb_shareholder'

		}

		_this.getList = async (type) => {

			let value = [+req.language_id];

			let sql = "SELECT t1.id , t1.name , t1.link , t1.type , t1.pin,  t1.page_id , t1.images, t1.type_builder, t1.is_delete, t1.link_video, t1.orders, ";

			sql += " t1.status , t1.maker_date, t2.name AS parent_name ";

			sql += " FROM " + table.page + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.language_id = $1 ";

			if (type && type > 0) {

				value.push(type);

				if (type == 2) {

					sql += " AND (t1.type = $2 OR t1.type = 1)"

				} else {

					sql += " AND t1.type = $2 ";
				}
			}

			sql += " ORDER BY t1.orders ASC";

			return await req.module.asyncQuery(sql, value);

		}

		_this.getRow = async (id) => {

			let sql = "SELECT t1.*, t2.name as parent_name FROM " + table.page + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updateStatus = async (id) => {

			const sql = `UPDATE ${table.page}  SET status = (select CASE WHEN t1.status = 1 THEN 0 ELSE 1 END from ${table.page} AS t1 where t1.id = $1) WHERE id = $1 `;

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.updatePin = async (id) => {

			const sql = `UPDATE ${table.page}  SET pin = (select CASE WHEN t1.pin = 1 THEN 0 ELSE 1 END from ${table.page} AS t1 where t1.id = $1) WHERE id = $1 `;

			return await req.module.asyncQuery(sql, [id]);
		};

		_this.getGrouptype = async (type) => {

			let sql = "SELECT t1.id, t1.code, t1.name, t1.link, t2.count, t1.orders ";

			sql += " FROM " + table.page + " AS t1 ";

			switch (+type) {

				case 3:
				// sql += " LEFT JOIN (SELECT COUNT(id) AS count , page_id FROM " + table.product + " GROUP BY page_id) AS t2 On t1.id = t2.page_id";
				// break;

				case 4:
					sql += " LEFT JOIN (SELECT COUNT(id) AS count , page_id FROM " + table.content + " GROUP BY page_id) AS t2 On t1.id = t2.page_id";
					break;

				case 5:
					sql += " LEFT JOIN (SELECT COUNT(id) AS count , page_id FROM " + table.library + " GROUP BY page_id) AS t2 On t1.id = t2.page_id";
					break;

				default:
					break;
			}

			sql += " WHERE t1.type = $1 AND t1.status = 1 AND t1.id NOT IN (";

			sql += " SELECT v1.page_id FROM tb_page as v1 ";

			sql += " LEFT JOIN tb_page AS v2 ON t1.id = v2.page_id) AND t1.language_id = $2 ORDER BY t1.orders ASC";

			return await req.module.asyncQuery(sql, [type, +req.language_id]);
		}

		_this.getListLibrary = async () => {

			let sql = "SELECT id, name FROM " + table.page + " WHERE type = 5 AND page_id = 0 AND language_id = $1 ";

			return await req.module.asyncQuery(sql, [+req.language_id]);
		}

		_this.checkProcess = async (link, type, id) => {

			let value = [link, type, +req.language_id];

			let sql = "SELECT COUNT(id) AS count FROM " + table.page + " WHERE link = $1 AND type = $2 AND language_id = $3 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $4 ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.page + " SET $" : "UPDATE " + table.page + " SET $ WHERE id = $ ";

			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.checkRemove = async (type, id) => {

			let sql = "SELECT COUNT(id) AS countParent ";

			switch (+type) {

				case 1:
					sql += " , (SELECT COUNT(id) as count FROM " + table.page + " WHERE page_id = $1 ) AS count";
					break;

				case 2:
					sql += " , (SELECT COUNT(id) as count FROM " + table.page + " WHERE page_id = $1 ) AS count";
					break;

				case 3:
					sql += " , (SELECT COUNT(id) as count FROM " + table.content + " WHERE parent_id = $1 ) AS count";
					break;

				case 4:
					sql += " , (SELECT COUNT(id) as count FROM " + table.content + " WHERE parent_id = $1 ) AS count";
					break;

				case 5:
					sql += " , (SELECT COUNT(id) as count FROM " + table.library + " WHERE page_id =  $1 ) AS count";
					break;

				default:
					break;
			}

			sql += " FROM " + table.page + " WHERE page_id = $2 ";

			return await req.module.asyncQuery(sql, [id, id]);
		}

		_this.remove = async (id) => {

			let sql = "DELETE FROM " + table.page + " WHERE is_delete != 1 AND id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkCode = async (code) => {

			let sql = "SELECT COUNT(id) AS count FROM " + table.page + " WHERE code = $1 ";

			return await req.module.asyncQuery(sql, [code]);
		};

		_this.getListParent = async () => {

			const sql = `	SELECT id, name FROM ${table.page} WHERE language_id = $1 AND status = 1 AND page_id = 0	`;

			return await req.module.asyncQuery(sql, [+req.language_id]);
		};
	}
}