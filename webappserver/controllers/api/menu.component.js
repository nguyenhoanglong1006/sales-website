module.exports = (req, io) => {

	return new function () {

		const _this = this;

		const _lang = (req.lang) ? req.lang : {};

		const _module = require('./menu.module')(req);

		_this.get = async () => {

			let position = req.params.position || '';
			
			if (position != '') {

				let data = await _module.getMenu(position);

				req.success(null, data);

			} else {

				req.failure();
			}
		}
	}
}