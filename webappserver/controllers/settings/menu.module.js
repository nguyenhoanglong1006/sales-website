module.exports = (req) => {

    return new function () {

        const _this = this;

        const table = {

            menu: 'tb_config_menu',

            page: 'tb_page',
        }

        _this.getList = async () => {

            let sql = "SELECT t1.id , t1.name , t1.maker_date, t1.status, t1.orders ";

            sql += " FROM " + table.menu + " AS t1 ORDER BY t1.orders ASC";

            return await req.module.asyncQuery(sql);
        }

        _this.getRow = async (id) => {

            let sql = "SELECT * FROM " + table.menu + " WHERE id = $1 ";

            return await req.module.asyncQuery(sql, [id]);
        }

        _this.process = async (data, id) => {

            let sql = "UPDATE " + table.menu + " SET $ WHERE id= $ ";

            return await req.module.asyncQuery(sql, [data, id]);
        }

        _this.changeOrdersPage = async (id, orders) => {

            let sql = "UPDATE " + table.page + " SET orders = $1 WHERE id = $2 ";

            return await req.module.asyncQuery(sql, [orders, id]);
        }
    }
}