module.exports = (req) => {

    return new function () {

        const _this = this;

        const table = {

            setting: 'tb_setting'
        }

        _this.getList = async (group_setting) => {

            value = [group_setting, req.language_id];

            let sql = "SELECT t1.id, t1.title, t1.text_key, t1.value, t1.type, t1.status, t1.language_id ";

            sql += " FROM " + table.setting + " AS t1  ";

            sql += " WHERE t1.group_setting = $1 AND t1.status = 1 AND t1.language_id = $2";

            sql += " ORDER BY t1.orders ASC";

            return await req.module.asyncQuery(sql, value);
        }

        _this.process = async (data, id) => {

            let sql = "UPDATE " + table.setting + " SET $ WHERE id = $ ";

            return await req.module.asyncQuery(sql, [data, id]);
        }
    }
}