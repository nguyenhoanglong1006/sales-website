const path = require('path');

module.exports = (req, io) => {

    return new function (flags = false) {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./sitemap.module')(req);

        const _xml = require(path.resolve('./library/xml'))(req);

        const _other = require('./other.module')(req);

        _this.createsitemappage = async (flags = false, language = 0) => {

            let domain = await _other.getList(3);

            domain = domain[0].value.slice(-1) == '/' ? domain[0].value : (domain[0].value + '/');

            let resultVN, resultEN;

            if (language > 0) {

                language == 1 ? resultVN = await _module.getXMLPage(domain, 1) : resultEN = await _module.getXMLPage(domain, 2);

            } else {

                resultVN = await _module.getXMLPage(domain, 1);

                resultEN = await _module.getXMLPage(domain, 2);
            }

            let length = flags ? 0 : (+resultVN.length + (+resultEN.length));

            if (resultVN && resultVN.length > 0) {

                resultVN.unshift({ link: domain });

                resultVN = await _xml.actionXML({
                    link: '',
                    data: { list: resultVN, language: 1 },
                    action: 'rebuild',
                    type: 2,
                });

            }

            if (resultEN && resultEN.length > 0) {

                resultEN.unshift({ link: domain + 'en/' });

                resultEN = await _xml.actionXML({
                    link: '',
                    data: { list: resultEN, language: 2 },
                    action: 'rebuild',
                    type: 2,
                });
            }

            !flags ? (resultVN && resultEN ? req.success(null, { type: 'page', length: length }) : req.failure()) : '';
        }

        _this.createsitemappost = async (flags = false, language = 0) => {

            let domain = await _other.getList(3);

            domain = domain[0].value.slice(-1) == '/' ? domain[0].value : (domain[0].value + '/');

            let resultVN, resultEN;

            if (language > 0) {

                language == 1 ? resultVN = await _module.getXMLPost(domain, 1) : resultEN = await _module.getXMLPost(domain, 2);

            } else {

                resultVN = await _module.getXMLPost(domain, 1);

                resultEN = await _module.getXMLPost(domain, 2);

            }

            let length = flags ? 0 : (+resultVN.length + (+resultEN.length));

            if (resultVN && resultVN.length > 0) {

                resultVN.unshift({ link: domain });

                resultVN = await _xml.actionXML({
                    link: '',
                    data: { list: resultVN, language: 1 },
                    action: 'rebuild',
                    type: 4,
                });

            }

            if (resultEN && resultEN.length > 0) {

                resultEN.unshift({ link: domain + 'en/' });

                resultEN = await _xml.actionXML({
                    link: '',
                    data: { list: resultEN, language: 2 },
                    action: 'rebuild',
                    type: 4,
                });
            }

            !flags ? (resultVN && resultEN ? req.success(null, { type: 'post', length: length }) : req.failure()) : '';

        }

        _this.changesitemap = async () => {

            let domain = await _other.getList(3);

            domain = domain[0].value.slice(-1) == '/' ? domain[0].value : (domain[0].value + '/');


            result = await _xml.actionXML({
                link: '',
                data: [
                    { link: domain + 'uploads/sitemap/page/page-sitemap.xml' },
                    { link: domain + 'uploads/sitemap/page/page-en-sitemap.xml' },
                    { link: domain + 'uploads/sitemap/post/post-sitemap.xml' },
                    { link: domain + 'uploads/sitemap/post/post-en-sitemap.xml' },
                ],
                action: 'change',
            });

            result ? req.success(null) : req.failure();

        }

    }
}