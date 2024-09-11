module.exports = (req) => {

    return new function() {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const table = {

        }

        _this.getListOn = async (table) => {

            let sql = "SELECT COUNT(id) AS count FROM "+ table +" WHERE status = 1 AND language_id = $1";

            return await req.module.asyncQuery(sql, [req.language_id]);

        }

        _this.getListOff = async (table) => {

            let sql = "SELECT COUNT(id) AS count FROM "+ table +" WHERE status = 0 AND language_id = $1 ";

            return await req.module.asyncQuery(sql, [req.language_id]);

        }

    }
}