const sanitizeHtml = require('sanitize-html');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./product.module')(req);

        _this.getdetail = async () => {
            let link = req.params.link || '';

            result = await _module.getDetail(link);
            
            let skip = result.length > 0 ? true : false;

            if (skip) {

                await _module.updateViews(link);

                req.success(null, (result && result.length > 0) ? result[0] : {});

            } else {

                req.failure(_lang.notFoundData);
            }
        }
   
        _this.getproduct = async () => {

            let link = req.params.link || '';

            let result = await _module.getProduct(link);

            let skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getlink = async () => {

            let link = req.params.link || '';

            let result = await _module.getLink(link);

            let skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, (result && result.length > 0) ? result[0] : {});

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.productcategory = async () => {

            let result = await _module.getCategory();

            let skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }
}
}