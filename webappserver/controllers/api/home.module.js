module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			title: 'tb_website_config',

			slide: 'tb_slide',

			product: 'tb_product',

			page: 'tb_page',

			content: 'tb_content',

			configAddress: 'tb_config_address',

			language: 'tb_language',

			customers: 'tb_customer',

		}

		_this.getCompany = async () => {

			let url = req.config.base_url + 'public/website/';

			let sql = "SELECT id, name, description, (CASE WHEN logo!='' THEN CONCAT('" + url + "', logo) ELSE '' END) as logo, ";

			sql += " (CASE WHEN logo_white !='' THEN CONCAT('" + url + "', logo_white) ELSE '' END) as logo_white,";

			sql += " (CASE WHEN shortcut !='' THEN CONCAT('" + url + "', shortcut) ELSE '' END) as shortcut ";

			sql += " FROM " + table.title + " WHERE id = 1 AND status = 1";

			return await req.module.asyncQuery(sql);
		}

		_this.getListSliders = async (type) => {

			let url = req.config.base_url;

			let sql = "SELECT id , name , maker_date, status , link, (CASE WHEN images!='' THEN CONCAT('" + url + "',images) ELSE '' END) AS images ";

			sql += " , (CASE WHEN images_mobile !='' THEN CONCAT('" + url + "',images_mobile) ELSE '' END) AS images_mobile ";

			sql += " FROM " + table.slide;

			sql += " WHERE type = $1 AND status = 1 ";

			sql += " ORDER BY orders ASC";

			return await req.module.asyncQuery(sql, [type]);
		}

		_this.getCategories = async (type) => {

			let url = req.config.base_url;

			let sql = "SELECT t1.id, t1.code, t1.name, t1.link, t1.orders, t1.page_id ";

			sql += " , (CASE WHEN t1.icon !='' THEN CONCAT('" + url + "',  t1.icon) ELSE '' END) AS icon ";

			sql += " FROM " + table.page + " AS t1 ";

			sql += " WHERE t1.type = 3 AND t1.status = 1 AND t1.page_id > 0 ";


			sql += " AND t1.language_id = 1 ORDER BY t1.orders ASC";

			return await req.module.asyncQuery(sql);
		}

		_this.getFeatured = async () => {

			let url = req.config.base_url;

			let sql = "SELECT t1.id, t1.language_id, t1.name , t1.price,  t1.price_sale, t1.status , t1.link, t1.views, t1.type, t1.percent, t2.link as href";

			sql += " , (CASE WHEN t1.images !='' THEN CONCAT('" + url + "public/products/',  t1.images) ELSE '' END) AS images ";

			sql += " FROM " + table.product + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.language_id = $1 AND t1.status = 1 AND t1.price > 0 AND t1.type->> 1 = '1' OR t1.type->> 0 = '1' ORDER BY t1.maker_date, t1.id ASC LIMIT 10";

			// sql += " ORDER BY orders ASC";

			return await req.module.asyncQuery(sql, [+req.language_id]);
		}

		_this.getHot = async () => {

			let url = req.config.base_url;

			let sql = "SELECT t1.id, t1.language_id, t1.name , t1.price,  t1.price_sale, t1.status , t1.link, t1.views, t1.type, t1.percent, t2.link as href";

			sql += " , (CASE WHEN t1.images !='' THEN CONCAT('" + url + "public/products/',  t1.images) ELSE '' END) AS images ";

			sql += " FROM " + table.product + " AS t1 ";

			sql += " LEFT JOIN " + table.page + " AS t2 ON t1.page_id = t2.id ";

			sql += " WHERE t1.language_id = $1 AND t1.status = 1 AND t1.price > 0 AND t1.type->> 2 = '2' OR t1.type->> 1 = '2' OR t1.type->> 0 = '2'  ORDER BY t1.maker_date, t1.id ASC LIMIT 10";

			// sql += " ORDER BY orders ASC";

			return await req.module.asyncQuery(sql, [+req.language_id]);
		}

		_this.getAddressFooter = async () => {

			let sql = "SELECT id, name, address, phone , email";

			sql += " FROM " + table.configAddress + " WHERE status = 1 AND  language_id = $1";

			sql += " ORDER BY orders ASC ";

			return await req.module.asyncQuery(sql, [req.language_id]);

		}

		_this.getPageCode = async (code) => {

			let sql = "SELECT id, name,link, description ";

			sql += " FROM " + table.page + " WHERE code = $1 AND status = 1 AND language_id = $2";

			return await req.module.asyncQuery(sql, [code, +req.language_id]);
		}

		_this.getNewsDidPin = async () => {

			const url = req.config.base_url;

			const sql = `SELECT t1.name, t1.description, t1.date, t1.link, t1.description, t1.views,

				(CASE WHEN t1.images != '' THEN CONCAT('${url}', t1.images) ELSE '' END) as images,

				t2.name as parent_name, t2.link as page_link

				FROM ${table.content} t1

				LEFT JOIN ${table.page} t2 ON t1.page_id = t2.id
		
				WHERE t1.status = 1 AND t1.language_id = $1  AND t1.pin = 1  
				
				ORDER BY t1.date DESC LIMIT 8;
			`;
			return await req.module.asyncQuery(sql, [req.language_id]);
		}

		
		_this.checkProcessEmail = async (email, id) => {
			
			let value = [email];

			let sql = "SELECT COUNT(id) AS count FROM " + table.customers + " WHERE email = $1 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $2 ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		
		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.customers + " SET $" : "UPDATE " + table.customers + " SET $ WHERE id= $ ";


			return await req.module.asyncQuery(sql, [data, id]);
		}

		
		_this.getAboutus = async () => {

			const url = req.config.base_url;

			const sql = `SELECT name, description, link, description, detail, title,

				(CASE WHEN images != '' THEN CONCAT('${url}', images) ELSE '' END) as image

				FROM ${table.page} WHERE link = 'gioi-thieu';
			`;
			return await req.module.asyncQuery(sql);
		}

		_this.getBanner = async (type) => {
			

			let url = req.config.base_url;

			let sql = "SELECT id , name , maker_date, status , link, title ,(CASE WHEN images!='' THEN CONCAT('" + url + "',images) ELSE '' END) AS images ";

			sql += " FROM " + table.slide;

			sql += " WHERE type = $1 AND status = 1 ";
			
			sql += " ORDER BY orders ASC";
			console.log(sql);
			return await req.module.asyncQuery(sql, [type]);
		}
	}
}