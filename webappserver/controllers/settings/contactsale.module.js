module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {
			sale: 'tb_contact_sale',
			product: 'tb_product'
		}

		_this.getList = async () => {

			let linkAvatar = req.config.base_url;

			let sql = "SELECT id, name , phone, email, link_fb, link_zalo, link_linkedin, maker_date, orders, status ";

			sql += " FROM " + table.sale;

			sql += " ORDER BY maker_date DESC";

			return await req.module.asyncQuery(sql);

		}
		_this.getRow = async (id) => {

			let sql = "SELECT * FROM " + table.sale + " WHERE id =  $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.changePassword = async (password, token, id) => {

			let sql = "UPDATE " + table.sale + " SET password = $1 , token = $2 WHERE id = $3 ";

			return await req.module.asyncQuery(sql, [password, token, id]);
		}

		_this.checkProcessEmail = async (email, id) => {

			let value = [email];

			let sql = "SELECT COUNT(id) AS count FROM " + table.sale + " WHERE email = $1 ";

			if (id > 0) {

				value.push(id); sql += " AND id != $2 ";
			}

			return await req.module.asyncQuery(sql, value);
		}

		_this.process = async (data, id) => {

			let sql = (id == 0) ? "INSERT INTO " + table.sale + " SET $" : "UPDATE " + table.sale + " SET $ WHERE id= $ ";


			return await req.module.asyncQuery(sql, [data, id]);
		}

		_this.remove = async (id) => {

			let sql = " UPDATE  " + table.sale + " SET status = 0 WHERE status = 1 AND id = $1 ";

			return await req.module.asyncQuery(sql, [id]);
		}

		_this.checkEmailSale = async () => {

            let sql = "SELECT id, phone, email, link_fb, link_zalo FROM " + table.sale ;

            return await req.module.asyncQuery(sql);

        }

		_this.getProduct = async (product_id) => {

			let url = req.config.base_url;

			let sql = "SELECT id, name, code,  link, detail, title, description, price,   price_sale , status";

			sql += "  FROM " + table.product ;

			sql += " WHERE status = 1 AND id = $1 AND language_id = $2";
			return await req.module.asyncQuery(sql, [product_id, req.language_id]);

		}
	}
}