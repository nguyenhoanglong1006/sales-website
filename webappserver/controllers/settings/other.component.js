const path = require('path');

const files = require(path.resolve('./library/upfile'));

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./other.module')(req);

        _this.getlist = async () => {

            let group_setting = req.params.group || 0;

            let language_id =  req.params.lang_id || 0;

            let result = await _module.getList(group_setting,language_id);

            req.success(null, result);
        }

        _this.process = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false;

            if (Object.keys(data).length > 0 && id > 0) {

                data.maker_date = req.Date.datetime();

                data.maker_id = req.crypto.decrypt(req.auth.info_id);

                if (data.type == 2 && data.value) {

                    data.value = files(data.value);
                }

                let result = await _module.process(data, id);
                
                skip = result.rowCount > 0 ? true : false;

            }
            skip == true ? req.success() : req.failure();
        }
    }
}