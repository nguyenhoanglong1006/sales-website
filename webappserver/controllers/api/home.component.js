
module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./home.module')(req);

        _this.getcompany = async () => {

            let result = await _module.getCompany();

            if (result.length > 0) {

                req.success(null, result[0]);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getlistsliders = async () => {

            let type = req.params.type;

            let result = await _module.getListSliders(type);

            let skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getcategories = async () => {

            let type = req.params.type; // 3 sản phẩm
            
            let result = await _module.getCategories();

            let skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getproduct = async () => {

            let featured = await _module.getFeatured();
            
            let hot = await _module.getHot();

            let skip = (featured.length || featured.length) > 0 ? true : false;

            if (skip) {

                req.success(null, { featured: featured, hot: hot});

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getaboutus = async () => {
            
            let result = await _module.getAboutus();

            let skip = (result.length || result.length) > 0 ? true : false;

            if (skip) {

                req.success(null, result[0]);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getnews = async () => {

            let result = await _module.getNewsDidPin();

            let skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getaddressfooter = async () => {

            const result = await _module.getAddressFooter();

            req.success(null, result);
        }

        _this.getbanner = async () => {

            let type = req.params.type;

            let result = await _module.getBanner(type);

            result = result && result.length > 0 ? result[0] : {}

            req.success(null, result);
        }
        
    }
}