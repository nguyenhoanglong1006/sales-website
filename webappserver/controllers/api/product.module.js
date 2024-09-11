module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			title: 'tb_website_config',

			product: 'tb_product',

			language: 'tb_language',

			page: 'tb_page'
		}

		_this.getDetail = async (link) => {

			let sql = "SELECT t1.id, t1.name, t1.code,  t1.link, t1.detail, t1.title, t1.description, t1.price,  t1.price_sale, t1.status, t1.listimages, t1.images, t2.link as href, t2.name as parent_name, t1.video, t1.video_link, origin";

			sql += "  FROM " + table.product + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.status = 1 AND t1.link = $1 AND t1.language_id = $2 ORDER BY date ASC ";

			return await req.module.asyncQuery(sql, [link, req.language_id]);

		}

		_this.getProduct = async (link) => {

			let url = req.config.base_url;

			let sql = "SELECT t1.id, t1.language_id, t1.name , t1.price,  price_sale, t1.status , t1.link, t1.views, t1.percent, t2.link as href, t1.type, origin";

			sql += " , (CASE WHEN t1.images !='' THEN CONCAT('" + url + "public/products/',  t1.images) ELSE '' END) AS images ";

			sql += " FROM " + table.product + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " LEFT JOIN " + table.page + " AS t3 ON t3.id = t2.page_id ";

			sql += " WHERE t1.language_id = $1 AND t1.status = 1 AND t1.price > 0";

			if (link != '' && link != 'khac' && link != 'noi-bat' && link != "ban-chay") {
				sql += " AND  (t2.link = $2 OR t3.link = $2)";
			}

			if (link == 'khac') {
				sql += " AND  (t1.page_id = 0)";
			}

			if (link == 'noi-bat') {
				sql += " AND t1.type->> 1 = '1' OR t1.type->> 0 = '1'";
			}

			if (link == 'ban-chay') {
				sql += " AND t1.type->> 2 = '2' OR t1.type->> 1 = '2' OR t1.type->> 0 = '2' ";
			}
			
			if (link != '' && link != 'khac' && link != 'noi-bat' && link != "ban-chay") {

				return await req.module.asyncQuery(sql, [+req.language_id, link]);

			} else {
				
				return await req.module.asyncQuery(sql, [+req.language_id]);
			}
		}

		_this.getLink = async (link) => {

			let sql = "SELECT t1.id, t1.language_id, t1.name , t1.link, t2.link as href, t2.name as parent_name";

			sql += " FROM " + table.page + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.id = t2.page_id ";

			sql += " WHERE t1.language_id = $1 AND t1.status = 1 AND  t1.link = $2";

			return await req.module.asyncQuery(sql, [+req.language_id, link]);
		}

		_this.updateViews = async (link) => {

			let sql = "UPDATE " + table.product + " SET views = views + 1 WHERE link= $1 AND language_id = $2 ";

			return await req.module.asyncQuery(sql, [link, req.language_id]);
		}

		_this.getCategory = async () => {

			let value = [+req.language_id];

			let sql = "SELECT t1.id , t1.name , t1.link , t1.type , t1.pin,  t1.page_id, t1.type_builder, t1.is_delete, t1.link_video, t1.orders, ";

			sql += " t1.status , t1.maker_date, t2.name AS parent_name ";

			sql += " , (CASE WHEN t1.icon!='' THEN CONCAT('" + url + "',t1.icon) ELSE '' END) AS t1.icon ";

			sql += " FROM " + table.page + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.language_id = $1  AND t1.type = 3";

			sql += " ORDER BY t1.orders ASC";

			return await req.module.asyncQuery(sql, value);

		}
	}

}
