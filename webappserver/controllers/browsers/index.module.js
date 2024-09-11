module.exports = (req) => {

    return new function () {

        const _this = this;

        const table = {

            user: 'tb_user',

            otp: 'tb_otp',

            customer: 'tb_customer'

        }

        _this.checkProcessLogin = async (email, password, token = '') => {

            let value = [email, password];

            let sql = " SELECT id, name, code, sex, birth_date, phone, email , address, password, token, avatar, permission AS authorization, is_delete";

            sql += " FROM " + table.user + " WHERE email = $1 AND password = $2 AND status = 1";

            if (token != '') {

                value.push(token);

                sql += " AND token = $3 ";
            }

            return await req.module.asyncQuery(sql, value);
        }

        _this.checkEmail = async (email) => {

            let sql = "SELECT id FROM " + table.user + " WHERE email= $1 AND status = 1";

            return await req.module.asyncQuery(sql, [email]);

        }

        _this.checkEmailCustomer = async (email) => {

            let sql = "SELECT id FROM " + table.customer + " WHERE email= $1 AND status = 1";

            return await req.module.asyncQuery(sql, [email]);

        }

        _this.getRowByEmail = async (email) => {

            let sql = "SELECT * FROM " + table.user + " WHERE email = $1 ";

            return await req.module.asyncQuery(sql, [email]);
        }

        _this.getRowByCustomerEmail = async (email) => {

            let sql = "SELECT * FROM " + table.customer + " WHERE email = $1 ";

            return await req.module.asyncQuery(sql, [email]);
        }

        _this.process = async (data, id) => {

            let sql = (id == 0) ? "INSERT INTO " + table.user + " SET $" : "UPDATE " + table.user + " SET $ WHERE id = $ ";

            return await req.module.asyncQuery(sql, [data, id]);
        }

        _this.processCustomer = async (data, id) => {

            let sql = (id == 0) ? "INSERT INTO " + table.customer + " SET $" : "UPDATE " + table.customer + " SET $ WHERE id = $ ";

            return await req.module.asyncQuery(sql, [data, id]);
        }

        _this.processOtp = async (data, id) => {

            let sql = (id == 0) ? "INSERT INTO " + table.otp + " SET $" : "UPDATE " + table.otp + " SET $ WHERE id = $";

            return await req.module.asyncQuery(sql, [data, id]);
        }

        _this.getOtp = async (accountId) => {

            let sql = "SELECT id FROM " + table.otp + " WHERE user_id = $1";

            return await req.module.asyncQuery(sql, [accountId]);
        }

        _this.otpCheck = async (email, otp) => {

            let sql = "SELECT COUNT(t2.id) AS count FROM " + table.otp + " AS t1";

            sql += " LEFT JOIN " + table.user + " AS t2 ON t1.user_id = t2.id";

            sql += " WHERE t2.email = $1 AND t1.otp = $2 ";

            return await req.module.asyncQuery(sql, [email, otp]);
        }

        _this.otpCheckCustomer = async (email, otp) => {

            let sql = "SELECT COUNT(t2.id) AS count FROM " + table.otp + " AS t1";

            sql += " LEFT JOIN " + table.customer + " AS t2 ON t1.customer_id = t2.id";

            sql += " WHERE t2.email = $1 AND t1.otp = $2 ";

            return await req.module.asyncQuery(sql, [email, otp]);
        }

        _this.getTokenUser = async (token, request) => {

            let sql = "SELECT t1.token FROM " + table.user + " AS t1 WHERE t1.token = $1";

            return await request.module.asyncQuery(sql, [token]);

        }


    }
}