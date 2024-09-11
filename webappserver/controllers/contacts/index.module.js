module.exports = (req) => {

    return new function () {

        const _this = this;

        const table = {

            contact: 'tb_contact',

            user: 'tb_user',
        }

        _this.getList = async () => {

            let sql = "SELECT t1.id, t1.email, t1.message, t1.checked, t1.status, t1.maker_date, t1.level, t2.name AS user_name ";

            sql += " FROM " + table.contact + " AS t1 ";

            sql += " LEFT JOIN " + table.user + " AS t2 ON t1.maker_id = t2.id WHERE t1.status > 0";

            return await req.module.asyncQuery(sql);
        }

        _this.getRow = async (id) => {

            let sql = "SELECT t1.* FROM " + table.contact + " AS t1 WHERE t1.id = $1 ";

            return await req.module.asyncQuery(sql, [id]);
        }

        _this.process = async (data, id) => {

            let sql = "UPDATE " + table.contact + " SET $ WHERE id = $ ";

            return await req.module.asyncQuery(sql, [data, id]);
        }
    }
}