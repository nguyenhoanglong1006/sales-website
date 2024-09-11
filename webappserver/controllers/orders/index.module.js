module.exports = (req) => {

    return new function () {

        const _this = this;

        const table = {

            orders: 'tb_orders',

            detail: 'tb_order_detail',

            customer: 'tb_customer',

            product: 'tb_product',
        }

        _this.getList = async () => {

            let sql = "SELECT t1.id, t1.code, (CASE WHEN  t1.phone!='' THEN t1.phone ELSE t2.phone END) as phone, t1.name, t1.customer_address, t1.total_price, t1.total_sale, t1.total_payment, t1.delivery_status, t1.status, t1.maker_date";

            sql += " FROM " + table.orders + " AS t1 ";

            sql += " LEFT JOIN " + table.customer + " AS t2 ON t1.customer_id = t2.id "

            sql += " ORDER BY t1.status DESC";

            return await req.module.asyncQuery(sql);

        }

        _this.getItem = async (id) => {
            
            console.log(this.getItem);

            let sql = "SELECT t1.id, t1.amount, t1.price, t1.attribute, t1.total, t2.code, t2.name";

            sql += " FROM " + table.detail + " AS t1";

            sql += " LEFT JOIN " + table.product + " AS t2 ON t2.id = t1.product_id";

            sql += " LEFT JOIN " + table.orders + " AS t3 ON t3.id = t1.order_id";

            sql += " WHERE t3.id = $1 ";

            return await req.module.asyncQuery(sql, [id]);

        }

        _this.getRow = async (id) => {

            let sql = `SELECT

             t1.code, t1.total_price, t1.total_sale, t1.total_payment
            ,  (CASE WHEN t1.name !='' THEN t1.name ELSE t2.name END) as customer_name
            ,  (CASE WHEN t1.customer_address !='' THEN t1.customer_address ELSE t2.address END) as customer_address
            ,  (CASE WHEN t1.phone !='' THEN t1.phone ELSE t2.phone END) as customer_phone
            ,  (CASE WHEN t1.email !='' THEN t1.email ELSE t2.email END) as customer_email`

            sql += " FROM " + table.orders + " AS t1";

            sql += " LEFT JOIN " + table.customer + " AS t2 ON t2.id = t1.customer_id";

            sql += " WHERE t1.id = $1 ";

            return await req.module.asyncQuery(sql, [id]);

        }

        _this.process = async (data, id) => {

            let sql = "UPDATE " + table.orders + " SET $ WHERE id = $ ";

            return await req.module.asyncQuery(sql, [data, id]);
        }

        _this.updateDeliveryStatus = async (id) => {

            const sql = `UPDATE ${table.orders}  SET delivery_status = (select CASE WHEN t1.delivery_status = 1 THEN 0 ELSE 1 END from ${table.orders} AS t1 where t1.id = $1) WHERE id = $1 `;

            return await req.module.asyncQuery(sql, [id]);
        }
    }
}