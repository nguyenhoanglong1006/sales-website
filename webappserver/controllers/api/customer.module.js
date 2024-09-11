module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			customers: 'tb_customer',

			orders: 'tb_orders',

            order_detail: 'tb_order_detail'

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

        _this.checkProcessLogin = async (email, password, token = '') => {

            let value = [email, password];

            let sql = " SELECT id, name, code, sex, birth_date, phone, email , address, password, token, avatar, is_delete";

            sql += " FROM " + table.customers + " WHERE email = $1 AND password = $2 AND status = 1";

            if (token != '') {

                value.push(token);

                sql += " AND token = $3 ";
            }
			
            return await req.module.asyncQuery(sql, value);
        }
		
        _this.checkEmail = async (email) => {

            let sql = "SELECT id FROM " + table.customers + " WHERE email= $1 AND status = 1";

            return await req.module.asyncQuery(sql, [email]);

        }

        _this.getOrderList = async(id) => {

            let sql = "SELECT t1.id, t1.code, t1.phone, t2.name, t1.customer_address, t1.total_price, t1.total_sale, t1.total_payment, t1.delivery_status, t1.status, t1.maker_date";

            sql += " FROM " + table.orders + " AS t1 ";

            sql += " LEFT JOIN " + table.customers + " AS t2 ON t1.customer_id = t2.id";

			sql += " WHERE t1.customer_id = $1";

            return await req.module.asyncQuery(sql, [id]);

        }

        _this.getCustomer = async(email) => {

            let url = req.config.base_url;
            
            let sql = "SELECT id, phone, name, address, status, maker_date, email, sex,";

            sql += " (CASE WHEN avatar!='' THEN CONCAT('" + url + "', avatar) ELSE '' END) AS avatar";
            
            sql += " FROM " + table.customers + " WHERE email = $1";
            
            return await req.module.asyncQuery(sql, [email]);

        }

        _this.checkPass = async (old_pass, id) => {

            let sql = "SELECT id FROM " + table.customers + " WHERE password = $1 AND status = 1 AND id = $2";

            return await req.module.asyncQuery(sql, [old_pass, id]);

        }

        _this.changePass = async (pass, id) => {

            let sql = "UPDATE " + table.customers + " SET password = $1  WHERE id= $2 ";
            
            return await req.module.asyncQuery(sql, [pass, id]);

        }

		_this.addOrder = async (data) => {

			let sql = "INSERT INTO " + table.orders + " SET $" ;

			return await req.module.asyncQuery(sql, [data]);
		}

        
		_this.addOrderDetail = async (data) => {

			let sql = "INSERT INTO " + table.order_detail + " SET $" ;

			return await req.module.asyncQuery(sql, [data]);
		}
	}
}