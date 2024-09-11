module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./menu.module')(req);

        _this.getlist = async () => {

            let result = await _module.getList();

            req.success(null, result);
        }

        _this.getrow = async () => {

            let id = req.params.id || 0;

            let result = await _module.getRow(id);

            result = result && result.length > 0 ? result[0] : {}

            req.success(null, result);
        }

        _this.process = async () => {

			let data = req.data || {};

            let id = req.params.id || 0;

			if(Object.keys(data).length > 0){

                data.maker_date = req.Date.datetime();

                data.maker_id = req.crypto.decrypt(req.auth.info_id);

				let result = await _module.process(data, id);

				(result.rowCount > 0) ? req.success(null) : req.failure();

			} else {

				req.failure();
			}
		}

        _this.changeorders  = async () => {

            let id = +req.params.id || 0;

            let orders = +req.data.orders || 0;

            let skip = false;

            let message = _lang.failure;

            if (id > 0) {

                let result = await _module.changeOrdersPage(id, orders);

                skip = +result.rowCount > 0  ? true : false;
            }

            skip == true ? req.success() : req.failure(message);
        }
    }
}