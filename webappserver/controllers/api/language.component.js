module.exports = (req, io) => {

	return new function () {

		const _this = this;

		const _lang = (req.lang) ? req.lang : {};

		const _module = require('./language.module')(req);

		_this.getlist = async () => {

			let result = await _module.getList();

			req.success(null, result);
		}

		_this.getlanguagesetting = async () => {
			
			let result = await _module.getLanguageSetting();

			req.success(null, result);
		}
	}
}