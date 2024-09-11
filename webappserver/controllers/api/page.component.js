const sanitizeHtml = require('sanitize-html');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./page.module')(req);


        _this.getpage = async () => {

            let link = req.params.link || '';

            let parent_link = req.params.parent_link || '';

            let result = await _module.getPage(link);

            let skip = result.length > 0 ? true : false;
            
            if (skip) {
                
                result = result[0];
                
                result['data'] = await _module.getPageGroup(result.id, parent_link + '/' + link, 1);
                
                for (let i = 0; i < result['data'].length; i++) {

                    result['data'][i].data = await _module.getPageGroup(result['data'][i].id, result['data'][i].href, 2);

                    let list = result['data'][i].data;

                    result['data'][i].static = result['data'][i].data.length > 0 ? true : false;

                    for (let j = 0; j < list.length; j++) {

                        list[j].data = await _module.getPageGroup(list[j].id, list[j].href, 3);

                        list[j].static = list[j].data.length > 0 ? true : false;
                    }
                }
                req.success(null, result);
                
            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getinfopage = async () => {

            let link = req.params.link;

            let result = await _module.getInfoPage(link);

            req.success(null, result.length > 0 ? result[0] : {});
        }

        _this.getlistpage = async () => {

            let link = req.params.link || '';

            let limit = req.params.limit || 0;

            let start = req.params.start != '' ? req.Date.date(req.params.start) : '';

            let end =  req.params.end != '' ? req.Date.date(req.params.end) : '';

            let length = req.params.length || 0;

            let result = await _module.getPage(link);

            skip = result.length > 0 ? true : false;

            if (skip) {

                result = result[0];

                let pageId = (result.type == 7 && result.code == "allAnalysis") ? 0 : result.id;

                result['list'] = await _module.getListPage(result.type, result.code, pageId, limit, length, start, end);

                if ((result.type != 2 || result.code == 'sharingProgram') && result['list'].length > 0) {

                    result['count'] = await _module.getCountListPage(result.type, result.code, pageId, '', start, end, 0, 0, 0);

                    result['count'] = result['count'][0];

                    for (let i = 0; i < result['list'].length; i++) {

                        if (result['list'][i].description && result['list'][i].description.length > 0) {

                            result['list'][i].description = (sanitizeHtml(result['list'][i].description).toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).substring(0, 300) + '...';

                        }
                    }
                }

                if (result.list_library.length > 0) {

                    result.list_library = await _module.getCategoryLibrary(result.list_library);

                    for (let i = 0; i < result.list_library.length; i++) {

                        let item = result.list_library[i];

                        item.list = await _module.getGroupLibrary(item.id);

                        for (let j = 0; j < item.list.length; j++) {

                            item.list[j].library = await _module.getListLibrary(item.list[j].id);

                            item.list[j].images = (item.list[j].library.length > 0) ? item.list[j].library[0].images : '';

                            item.list[j].images_name = (item.list[j].library.length > 0) ? item.list[j].library[0].name : '';

                            item.list[j].library.shift();
                        }
                    }
                }

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getdetailpage = async () => {

            let link = req.params.link || '';

            let type = req.params.type || 0;

            let result = await _module.getDetailPage(type, link);

            skip = result.length > 0 ? true : false;

            if (skip) {

                result = result[0];

                if (type == 4 || type == 7) {

                    await _module.updateViews(type, link);

                    result['tags'] = await _module.getObjectTags(result.id);

                }

                if (type != 12) {

                    result['list'] = await _module.getOtherList(type, result.page_id, link);

                }
                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }
        
        _this.getcompany = async () => {

            let result = await _module.getCompany();

            skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }


        _this.getvaluefilter = async () => {

            let keywords = req.params.value || '';

            let companyId = req.params.companyId || 0;

            let industryId = req.params.industryId || 0;

            let stockId = req.params.stockId || 0;

            let start = req.Date.date(req.params.start);

            let end = req.Date.date(req.params.end);

            let link = req.params.link || '';

            let limit = req.params.limit || 0;

            let length = req.params.length || 0;

            let result = await _module.getPage(link);

            skip = result.length > 0 ? true : false;

            if (skip) {

                result = result[0];

                let pageId = (result.type == 7 && result.code == "allAnalysis") ? 0 : result.id;

                result['list'] = await _module.getValueFilter(result.type, pageId, keywords, start, end, companyId, industryId, stockId, limit, length);

                if ((result.type != 2 || result.code == 'sharingProgram') && result['list'].length > 0) {

                    result['count'] = await _module.getCountListPage(result.type, result.code, pageId, keywords, start, end, companyId, industryId, stockId);

                    result['count'] = result['count'][0];

                    for (let i = 0; i < result['list'].length; i++) {

                        if (result['list'][i].description && result['list'][i].description.length > 0) {

                            result['list'][i].description = (sanitizeHtml(result['list'][i].description).toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).substring(0, 300) + '...';
                        }
                    }
                }

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }


        _this.getpagetags = async () => {

            let link = req.params.link || '';

            let start = req.params.start || 0;

            let result = await _module.getPageTags(link);

            skip = result.length > 0 ? true : false;

            if (skip) {

                result = result[0];

                result['list'] = await _module.getListPageTags(result.id, start);

                if (result['list'] && result['list'].length > 0) {

                    result['count'] = await _module.getCountListPageTags(result.id);

                    result['count'] = result['count'][0];

                    for (let i = 0; i < result['list'].length; i++) {

                        if (result['list'][i].description && result['list'][i].description.length > 0) {

                            result['list'][i].description = (sanitizeHtml(result['list'][i].description).toString().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()).substring(0, 300) + '...';
                        }
                    }

                }

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.getpostviewmore = async () => {

            let tags_id = req.params.tags_id

            let result = await _module.getPostViewMore(tags_id);

            skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null, result);

            } else {

                req.failure(_lang.notFoundData);
            }
        }

        _this.checktypepage = async () => {

            let link = req.params.link || '';

            let result = await _module.checkTypePage(link);

            skip = result.length > 0 ? true : false;

            if (skip) {

                req.success(null);

            } else {

                req.failure();
            }
        }

        _this.checkpagelink = async () => {

            let link = req.params.link || '';

            let level = req.params.level || '';

            let result = await _this.recursiveCheckLink(link, level, '');

            req.success(null, result);


        }

        _this.recursiveCheckLink = async (link, level, link_new) => {

            link_new = link_new != '' ? (link_new + '/' + link) : link;

            let result = await _module.checkPageLink(link);

            if (result && result.length > 0 && level < 6) {

                level = +level + 1;

                return await _this.recursiveCheckLink(result[0].link, level, link_new);

            } else {

                return link_new;
            }


        };

        // _this.getbannerbylink = async () => {
        //     const { link } = req.params;

        //     if (!link) return req.failure(_lang.inValidateParams, { param: 'link' });

        //     const [result = {}] = await _module.getBannerByLink(link);

        //     req.success(null, result);
        // };
    }
}