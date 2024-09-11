module.exports = (req, io) => {

	return new function () {

		const _this = this;

		const _lang = (req.lang) ? req.lang : {};

		const _module = require('./email.module')(req);

		_this.get = async () => {

			let result = await _module.getRow();

			let data = (result.length > 0) ? result[0] : {};

			(result.length > 0) ? req.success(null, data) : req.failure();
		}

		_this.getConfigMail = async () => {

			let result = await _module.getRow();

			let data = (result.length > 0) ? result[0] : {};

			return data;
		}

		_this.set = async () => {

			let data = req.data;

			if (Object.keys(data).length > 0) {

				let result = await _module.process(data);

				(+result.rowCount > 0) ? req.success() : req.failure();

			} else {

				req.failure();
			}
		}
	}
}