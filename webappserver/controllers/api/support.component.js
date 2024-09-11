const sanitizeHtml = require('sanitize-html');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./support.module')(req);

        _this.addcontact = async () => {

            let data = req.data || {};

            data['maker_date'] = req.Date.datetime();

            const result = await _module.addContact(data);

            if (result.rowCount > 0) {

                req.success(_lang.contactSent);

            } else {

                req.failure();
            }
        }
    }
}