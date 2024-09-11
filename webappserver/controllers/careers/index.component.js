const path = require('path');

module.exports = (req, io) => {

    return new function() {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);

        const _xml = require('../settings/sitemap.component')(req);

        _this.getlist = async () => {

            let result = await _module.getList();

            req.success(null, result);
        }

        _this.workplace = async () => {

            let result = await _module.workplace();

            req.success(null, result);
        }

        _this.getrow = async () => {

            let id = req.params.id || 0;

            let code = req.params.code || '';

            let language_id = req.params.lang_id || 0;

            let result = await _module.getRow(id, code, language_id);

            req.success(null, result && result.length > 0 ? result[0] : {})

        }

        _this.changestatus = async () => {

            let id = +req.params.id || 0;

            if (id > 0) {

                let result = await _module.updateStatus(id);

                (result.rowCount > 0) ? req.success(null, {
                    id: id
                }): req.failure();

            } else {

                req.failure();
            }
        }

        _this.changepin = async () => {

            let id = +req.params.id || 0;

            if (id > 0) {

                let result = await _module.updatePin(id);

                (result.rowCount > 0) ? req.success(null, {
                    id: id
                }): req.failure();

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

                data.deadline = req.Date.datetime(data.deadline);

                data.language_id = language_id;

                if(id == 0){

                    let checkCode = await _module.checkCode(data.code);

                    data.code = (checkCode.length > 0 && checkCode[0].count == 2) ? ('ca' + String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000)) : data.code;
                }

                data.link = data.link ? req.toslug(data.link) : req.toslug(data.name);

                let checkProcess = await _module.checkProcess(data.link, data.workplace_id, id, language_id);

                if (checkProcess[0]['count'] == 0) {

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0) ? result.insertId : id;

                        await _xml.createsitemappage(true, language_id);

                        skip = true;
                    }

                } else {

                    message = _lang.linkContentExist;
                }
            }
            skip == true ? req.success(null,id) : req.failure(message);
        }

        _this.remove = async () => {

            let id = +req.params.id || 0;

            let skip = false;

            if (id > 0) {

                let result = await _module.remove(id);

                skip = +result.rowCount > 0  ? true : false;

                if (skip == true) {

                   await _xml.createsitemappage(true, req.language_id);
                }
                // end delete xml
            }

            skip == true ? req.success() : req.failure();
        }
    }
}