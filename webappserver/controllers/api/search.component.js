const sanitizeHtml = require('sanitize-html');

module.exports = (req, io) => {

	return new function () {

		const _this = this;

		const _lang = (req.lang) ? req.lang : {};

		const _module = require('./search.module')(req);

		_this.get = async () => {

			let keywords = req.params.keywords;

			let start = req.params.start || 0;

			let result = {};

			const LIMIT = 6;

			result = await _module.getValueSearch(keywords, LIMIT);

			// if(result['list'].length > 0){

			// 	result['list']= result['list'][0];

			// 	for(let i = 0 ;i < result['list'].length; i ++ ){

			// 		if(result['list'][i].description && result['list'][i].description.length > 0){

			// 			result['list'][i].description = sanitizeHtml((result['list'][i].description.toString().replace(/<[^>]*>/g, ''))).substring(0, 400);
			// 		}
			// 	}

			// 	result['count'] =  await _module.getValueSearch(keywords,0, -1);

			// 	result['count'] = result['count'][0][0].count_list;

			// }

			req.success(null, result);

		}

		_this.getorder = async () => {

			let keywords = req.params.keywords.toString() || '';

			let result = await _module.getOrder(keywords);

			result = result.length > 0 ? result[0] : {}

			result.list = await _module.getOrderList(keywords);

			req.success(null,result);

		}

		_this.getcontentnew = async () => {

			let result = await _module.getContentNew();

			if (result.length > 0) {

				req.success(null, result);

			} else {
				req.failure();
			}
		}
	}
}