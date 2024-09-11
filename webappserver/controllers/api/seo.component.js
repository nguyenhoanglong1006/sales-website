const sanitizeHtml = require('sanitize-html');
module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./seo.module')(req);

        _this.get = async () => {

            let link_url = req.params.link;

            let link = req.params.link.split('/') || [];

            link = link[link.length - 1].split('?')[0] || '';

            let company = await _module.getCompany() || [];

            let result = await _module.getPage(link) || [];

            if (result.length > 0 || company.length > 0) {

                company = company.length > 0 ? company[0] : {};

                result = result.length > 0 ? result[0] : {};

                result.detail = _this.convertDescription(result.detail);

                let data = await _this.extraData(company, result, link_url);

                req.success(null, data);

            } else {

                req.failure();
            }
        }


        _this.extraData = async (company, result, link) => {

            let name = result['name'] ? result['name'] : company['name'];

            let description = result['description'] ? result['description'] : company['description'];

            let shortcut = req.config.base_url + 'public/website/' + company['shortcut'];

            let logo = req.config.base_url + 'public/website/' + company['logo'];

            let images = result['images'] ? result['images'] : company['images'];

            let datePublished = result['date'] ? result['date'] : (result['maker_date'] ? result['maker_date'] : company['maker_date']);

            let dateModified = result['maker_date'] ? result['maker_date'] : company['maker_date'];

            let tags = result['tags'] ? result['tags'] : '';

            let hreflang = result['hreflang'] ? result['hreflang'] : (req.language_id == 1 ? (req.config.client_url + 'en') : req.config.client_url);

            datePublished = datePublished ? datePublished.toISOString().split('.')[0] : datePublished;

            dateModified = dateModified ? dateModified.toISOString().split('.')[0] : dateModified;

            return {

                title: name,

                logo: logo,

                shortcut: shortcut,

                name: name,

                description: description,

                tags: tags,

                hreflang: hreflang,

                language: req.language_id == 1 ? 'vi' : 'en',

                copyright: '2023',

                og_url: req.config.client_url + ((link != '/' || link != '/en') ? link.substr(1) : ''),

                og_title: name,

                og_description: description,

                og_image: (link == '/' || link == '/en' || !images) ? (req.config.base_url + 'public/website/logo.png') : images,

                og_full_image: (link == '/' || link == '/en' || !images) ? (req.config.base_url + 'public/website/logo.png') : images,

                locale: req.language_id == 1 ? 'vi_VN' : 'en_VN',

                datePublished: datePublished + "+07:00",

                dateModified: dateModified + "+07:00",
            }
        }

        _this.convertDescription = (value) => {

            value = (sanitizeHtml(value).toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).substring(0, 300) + '...';

            return value;
        }
    }
}