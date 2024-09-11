const path = require('path');

const files = require(path.resolve('./library/upfile'));

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./sliders.module')(req);

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

        _this.process = async () => {

            let id = +req.params.id || 0;

            let language_id = +req.params.lang_id || 0;

            let data = req.data || {};

            let skip = false;

            let message = _lang.failure;

            if (Object.keys(data).length > 0) {

                data.maker_date = req.Date.datetime();

                data.maker_id = req.crypto.decrypt(req.auth.info_id);

                data.language_id = language_id;

                if (id == 0) {

                    let checkCode = await _module.checkCode(data.code);

                    data.code = (checkCode.length > 0 && checkCode[0].count == 2) ? String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000) : data.code;
                }

                let checkProcess = await _module.checkProcess(data.name, id, language_id);

                if (checkProcess[0]['count'] == 0) {

                    if (data.images) {

                        data.images = files(data.images);
                    }

                    if (data.images_mobile) {

                        data.images_mobile = files(data.images_mobile);
                    }

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0) ? result.insertId : id;

                        skip = true;
                    }

                } else {

                    message = _lang.nameExist;
                }
            }

            skip == true ? req.success(null, { id: id }) : req.failure(message);
        }

        _this.remove = async () => {

            let id = +req.params.id || 0;

            let images = req.data || {};

            let skip = false;

            if (id > 0) {

                let result = await _module.remove(id);

                skip = +result.rowCount > 0 ? true : false;
            }
            skip == true ? files(images) : '';

            skip == true ? req.success() : req.failure();
        }
    }
}