module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			redirect: 'tb_redirect',

		}

		_this.getList = async () => {

			let sql = "SELECT link, link_redirect, status_code FROM " + table.redirect ;

			return await req.module.asyncQuery(sql);
		}

	}
}