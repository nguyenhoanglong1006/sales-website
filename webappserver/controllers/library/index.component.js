const path = require('path');

const files = require(path.resolve('./library/upfile'));

const fs = require('fs');

module.exports = (req, io) => {

    return new function() {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);

        _this.getlist = async () => {

            let result = await _module.getList();

            req.success(null, result);
        }

        _this.getrow = async () => {

            let id = req.params.id;

            let code = req.params.code || '';

            let language_id = req.params.lang_id || 0;

            let result = await _module.getRow(id, code, language_id);

            req.success(null, result.length > 0 ? result[0] : {});

        }

        _this.process = async () => {

            let data = req.data;

            let id = req.params.id || 0;

            let language_id = +req.params.lang_id || 0;

            if(Object.keys(data).length > 0){

                data.maker_id = req.crypto.decrypt(req.auth.info_id);

                data.maker_date = req.Date.datetime();

                data.language_id = language_id;

                if(id == 0){

                    let checkCode = await _module.checkCode(data.code);

                    data.code = (checkCode.length > 0 && checkCode[0].count == 2) ? String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000) : data.code;
                }

                let checkProcess = await _module.checkProcess(data.name, id, language_id);

                if(checkProcess[0]['count'] == 0){

                    if(data.images){

                        data.images = files(data.images);
                    }

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0 && result['serverStatus'] >= 2) {

                        id = (id == 0) ? result.insertId : id;

                        req.success(null,id);

                    } else {

                        req.failure();
                    }

                } else {

                    req.failure(_lang.nameExist);
                }

            } else {

                req.failure();
            }
        }

        _this.remove = async () => {

            let id = req.params.id || 0;

            let images = req.data || {};

            let result = await _module.getRow(id);

            if(result.length > 0){

                if(fs.existsSync(result[0].images)){

                   try { fs.unlinkSync(result[0].images); } catch(e){  }

               }
            }

            result = await _module.remove(id);

            if (result.rowCount > 0 && result['serverStatus'] >= 2) {

            req.success();

            } else {

                req.failure();
            }
        }
    }
}