const path = require('path');

const files = require(path.resolve('./library/upfile'));

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);

        const _xml = require('../settings/sitemap.component')(req);

        _this.getlist = async () => {

            let result = await _module.getList();

            req.success(null, result);
        }

        _this.getrow = async () => {

            let id = req.params.id || 0;

            let result = await _module.getRow(id);

            if (result && result.length > 0) {

                // result[0].tags = await _module.getContentTags(result[0].id);
            }

            req.success(null, result && result.length > 0 ? result[0] : {})
        }

        _this.changestatus = async () => {

            let id = +req.params.id || 0;

            let skip = false, message = _lang.failure;

            if (id > 0) {

                let result = await _module.updateStatus(id);

                skip = result.rowCount > 0 ? true : false;
            }

            skip == true ? req.success(null, { id: id }) : req.failure(message);
        }

        _this.process = async () => {

            let id = +req.params.id || 0;

            let language_id = +req.params.lang_id || 1;

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

                    if (data.listimages) {

                        data.listimages = files(data.listimages);
                    }
                    
                    if (data.video) {

                        data.video = files(data.video);
                    }

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0) ? result.rows[0] : id;

                        skip = true;
                    }

                } else {

                    message = _lang.nameExist;
                }
            }

            (skip == true) ? req.success(null, id) : req.failure(message);
        }

        _this.remove = async () => {

            let id = +req.params.id || 0;

            let images = req.data || {};

            let skip = false;
            
            let message = _lang.failure;

            if (id > 0) {

                await _module.removeproductTags(id);

                let result = await _module.remove(id);

                skip = result.rowCount > 0 ? true : false;

                if (skip == true) {

                    // files(images);

                    // await _xml.createsitemappost(true, req.language_id);
                }
            }
            skip == true ? req.success(null, { id: id }) : req.failure(message);
        }

        _this.updateprice = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false, message = _lang.failure;

            let getrow = {}

            if (Object.keys(data).length > 0) {

                let item = {

                    price: +data.price,

                    price_sale: +data.price_sale,

                    percent:  Math.round(100 - (+data.price_sale * 100)/  +data.price ) 
                }

                let result = await _module.process(item, id);

                if (result.rowCount > 0) {

                    id = (id == 0 && result.rows.length > 0) ? +result.rows[0].id : +id;
                    
                    getrow = await _module.getRow(id);

                    skip = true;
                }
            }
            skip == true ? req.success(null, getrow[0]) : req.failure(message);
        }
    }
}