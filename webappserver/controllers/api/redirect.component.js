module.exports = (req) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./redirect.module')(req);

        _this.getredirect = async () => {

            let result = await _module.getList();

            let skip = result.length > 0 ? true : false;

            if (skip) {

                result = result.reduce(function(n,o){

                    n[o.link] = o;

                    return n;
                    
                },[]);
                
                req.success(null, result);

            } else {

                req.failure();
            }
        }
    }
}