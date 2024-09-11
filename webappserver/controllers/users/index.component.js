const path = require('path');

const files = require(path.resolve('./library/upfile'));

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);

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

        _this.changepassword = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false;

            if (Object.keys(data).length > 0 && id > 0) {

                let password = req.crypto.encrypt(data.password);

                let token = req.crypto.hashToken(data.password);

                let result = await _module.changePassword(password, token, id);

                if (result.rowCount > 0) {

                    skip = true;

                }
            }

            skip == true ? req.success(null, { skip: +id === +req.crypto.decrypt(req.auth.info_id) ? true : false }) : req.failure();
        }

        _this.process = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false;

            let message = _lang.failure;

            if (Object.keys(data).length > 0) {

                data.maker_date = req.Date.datetime();

                data.maker_id = req.crypto.decrypt(req.auth.info_id);

                data.password = id > 0 ? data.password : req.crypto.encrypt(data.password);

                if (id == 0) {

                    data.token = req.crypto.hashToken(data.password);
                }

                if (data.avatar) {

                    data.avatar = files(data.avatar);
                }

                let checkProcess = await _module.checkProcessEmail(data.email, id);

                if (checkProcess[0]['count'] == 0) {

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0) ? result.insertId : id;

                        skip = true;
                    }

                } else {

                    message = _lang.emailExist;
                }
            }

            skip == true ? req.success() : req.failure(message);
        }

        _this.remove = async () => {

            let id = +req.params.id || 0;

            let skip = false;

            if (id > 0) {

                let result = await _module.remove(id);

                skip = +result.rowCount > 0  ? true : false;
            }

            skip == true ? req.success() : req.failure();
        }
    }
}