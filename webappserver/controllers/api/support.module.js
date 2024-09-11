module.exports = (req) => {

	return new function () {

		const _this = this;

		const table = {

			contact: 'tb_contact',
			language: 'tb_language'
		}

		_this.addContact = async (data) => {

			let sql = "INSERT INTO " + table.contact + " SET $" 

			return await req.module.asyncQuery(sql, [data]);
		}

	}
}