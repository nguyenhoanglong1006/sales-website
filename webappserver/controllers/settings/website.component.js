const path = require('path');

const files = require(path.resolve('./library/upfile'));

module.exports =(req ,io)=>{

	return new function() {

		const _this = this;

		const _lang = (req.lang) ? req.lang : {};

		const _module = require('./website.module')(req);

		_this.get = async()=> {

			let language_id = req.params.lang_id || 0;

			let result = await _module.getRow(language_id);

			(result.length > 0) ? req.success(null, result[0]) :  req.failure(null);	
		}

		_this.set = async () => {

			let data = req.data;

			let id = req.params.id || 0;

			if(Object.keys(data).length > 0){

				if(data.shortcut){

					data.shortcut = files(data.shortcut);
				}

				if(data.logo){

					data.logo = files(data.logo);
				}

				if(data.logo_white){

					data.logo_white = files(data.logo_white);
				}

				data.logo_white = data.logo_white || null;

				let result = await _module.process(data, id);

				(+result.rowCount > 0) ? req.success(null) : req.failure();

			} else {

				req.failure();
			}
		}
	}
}