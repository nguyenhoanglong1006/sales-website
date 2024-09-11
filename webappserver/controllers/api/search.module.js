module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			content: 'tb_content',

			analysisCenter: 'tb_analysis_center',

			shareholder: 'tb_shareholder',

			tags: 'tb_tags',

			product: 'tb_product',

			contentTags: 'tb_object_tags',

			page: 'tb_page',

			orders: 'tb_orders',

			detail: 'tb_order_detail',
		}

		_this.getValueSearch = async (keyword) => {

			let url = req.config.base_url;

			let sql = `
			SELECT 
			t1.name, 
			t1.code, 
			t1.views, 
			t1.price, 
		     t1.price_sale , 
			t1.status, 
			t1.link, 
			t2.link as href, 
			(CASE WHEN t1.images !='' THEN CONCAT('${url}public/products/',  t1.images) ELSE '' END) AS images, 
			t1.percent,
			t1.page_id
		FROM 
			public.tb_product t1
			LEFT JOIN public.tb_page t2 ON t1.page_id = t2.id
		WHERE 
			LOWER(t1.name) LIKE LOWER(CONCAT('%',$1::text,'%'))
			OR LOWER(t1.code) LIKE LOWER(CONCAT('%',$1::text,'%'))
			OR LOWER(t1.link) LIKE LOWER(CONCAT('%',$1::text,'%'))
			OR LOWER(TRANSLATE(
				t1.name, 
				'áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ', 
				'aaaaaaaaaaaaaaaaadeeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyy'
			)) LIKE LOWER(CONCAT('%',$1::text,'%'))
		ORDER BY t1.name`
			return await req.module.asyncQuery(sql, [keyword]);
		}

		_this.getOrder = async (keyword) => {

			let sql = "SELECT * FROM " + table.orders + " WHERE code = $1";

			return await req.module.asyncQuery(sql, [keyword]);
		}

		this.getOrderList = async (keyword) => {

			let sql = "SELECT t1.id, t1.amount, t1.price, t1.attribute, t1.total, t2.code, t2.name, t2.language_id, t2.link, t4.link as parent_link";

			sql += " , (CASE WHEN t2.images !='' THEN CONCAT('" + req.config.base_url + "public/products/',  t2.images) ELSE '' END) AS images ";

			sql += " FROM " + table.detail + " AS t1";

			sql += " LEFT JOIN " + table.product + " AS t2 ON t2.id = t1.product_id";

			sql += " LEFT JOIN " + table.orders + " AS t3 ON t3.id = t1.order_id";

			sql += " LEFT JOIN " + table.page + " AS t4 ON t2.page_id = t4.id ";

			sql += " WHERE t3.code = $1 ";

			return await req.module.asyncQuery(sql, [keyword]);
		}

		_this.getContentNew = async () => {

			let url = req.config.base_url + 'public/contents/';

			let sql = "SELECT t1.name, t1.description, t1.date, (CASE WHEN t3.link !='' AND t2.link !='' THEN CONCAT(t3.link,'/',t1.link) ELSE t1.link END) AS link ";

			sql += " ,(CASE WHEN t1.images !='' THEN CONCAT('" + url + "',t1.images) ELSE '' END) AS images ";

			sql += " FROM " + table.content + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " LEFT JOIN " + table.page + " AS t3 ON t2.page_id = t3.id";

			sql += " WHERE t1.status = 1  AND t1.language_id = $1 ORDER BY t1.date DESC LIMIT 5";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}
	}
}