module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./language.module')(req);

        _this.getlist = async () => {

            let result = await _module.getList();
            

            req.success(null, result);
        }



        _this.changestatus = async () => {

            let id = +req.params.id || 0;

            let status = req.data.status || 0;

            if (id > 0) {

                let result = await _module.updateStatus(status, id);

                (result.rowCount > 0) ? req.success(null, { id: id }) : req.failure();

            } else {

                req.failure();
            }
        }
    }
}