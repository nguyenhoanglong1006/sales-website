const path = require('path');

const files = require(path.resolve('./library/upfile'));

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);

        const _xml = require('../settings/sitemap.component')(req);

        _this.getlist = async () => {

            let type = req.params.type || 0;

            let result = await _module.getList(type);

            req.success(null, result);
        }


        _this.getrow = async () => {

            let id = req.params.id || 0;

            let result = await _module.getRow(id);

            req.success(null, result && result.length > 0 ? result[0] : {})
        }

        _this.changepin = async () => {

            let id = +req.params.id || 0;

            let skip = false, message = _lang.failure;

            if (id > 0) {

                let result = await _module.updatePin( id);

                skip = +result.rowCount > 0 ? true : false;
            }

            skip == true ? req.success() : req.failure(message);
        }

        _this.changestatus = async () => {

            let id = +req.params.id || 0;

            if (id > 0) {

                let result = await _module.updateStatus(id);

                (result.rowCount > 0) ? req.success(null, { id: id }) : req.failure();

            } else {

                req.failure();
            }
        }

        _this.getlistgroup = async () => {

            let type = +req.params.type || 0;

            if (type > 2) {

                let result = await _module.getGrouptype(type);

                req.success(null, result);
            }
        }

        _this.getlistlibrary = async () => {

            let language_id = req.params.lang_id || 0;

            let result = await _module.getListLibrary(language_id);

            req.success(null, result);
        }

        _this.process = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false;

            let message = _lang.failure;

            if (Object.keys(data).length > 0) {

                data.maker_date = req.Date.datetime();

                data.maker_id = +req.crypto.decrypt(req.auth.info_id);

                data.language_id = +req.language_id;

                if (data.type == 2) {

                    data.link = data.link ? req.toslug(data.link) : req.toslug(data.name);
                }

                if (id == 0) {

                    let checkCode = await _module.checkCode(data.code);

                    data.code = (checkCode.length > 0 && checkCode[0].count == 2) ? ('p' + String(Math.floor(Math.random() * (9999999999999 - 1000000000000 + 1)) + 1000000000000)) : data.code;
                }

                let checkProcess = data.type != 1 ? await _module.checkProcess(data.link, data.type, id) : [{ count: 0 }];

                if (checkProcess[0]['count'] == 0) {

                    if (data.images) {

                        data.images = files(data.images) || '';
                    }

                    if (data.icon) {

                        data.icon = files(data.icon) || '';
                    }

                    if (data.listimages) {

                        data.listimages = files(data.listimages) || null;
                    }

                    if (data.background) {

                        data.background = files(data.background) || '';
                    }

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0 && result.rows.length > 0) ? +result.rows[0].id : +id;

                        // await _xml.createsitemappage(true, language_id);

                        skip = true;
                    }

                } else {

                    message = _lang.linkPagesExist;
                }
            }
            skip == true ? req.success(null, id) : req.failure(message);
        }

        _this.remove = async () => {

            let id = +req.params.id || 0;

            let type = +req.params.type || 0;

            let images = req.data || {};

            let skip = false;

            let checkRemove = await _module.checkRemove(type, id);
            
            let message = _lang.failure;

            if (checkRemove[0]['countparent'] == 0) {

                if (checkRemove[0]['count'] == 0) {
                    
                    let result = await _module.remove(id);

                    skip = +result.rowCount > 0 ? true : false;

                    if (skip == true) {

                        files(images);

                        // await _xml.createsitemappage(true, req.language_id);
                    }


                } else {

                    switch (+type) {

                        case 4:
                            message = _lang.GroupContentExit;
                            break;

                        case 5:
                            message = _lang.GroupLibraryExit;
                            break;

                        case 7:
                            message = _lang.GroupContentExit;
                            break;

                        case 8:
                            message = _lang.GroupLibraryExit;
                            break;

                        case 11:
                            message = _lang.GroupLibraryExit;
                            break;

                        default:
                            break;
                    }

                }

            } else {

                message = _lang.GroupParentExit;
            }

            skip == true ? req.success() : req.failure(message);
        };

        _this.getlistparent = async () => {

            const result = await _module.getListParent();

            req.success(null, result);
        };
    }
}