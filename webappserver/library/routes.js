const path = require('path');

const config = require(path.resolve('./config/config'));

const postgres = require(path.resolve('./library/postgres'));

const crypto = require(path.resolve('./library/crypto'));

const language = require(path.resolve('./translate/vi.json'));

const url = require('url');

const _mask = 'controllers';

const userInConnect = {};

module.exports =  async (req, res, next) => {

	const _token =  require(path.resolve('./controllers/browsers/index.component'))(req);

	var uri = url.parse(req.url, true);

	var language_id = 0;

	let pathname = uri.pathname.split("/");

	if (pathname && pathname.length > 0 && pathname[0].length == 0) {

		pathname = pathname.splice(1, pathname.length);

	}

	curl = ['folder', 'file', 'action'];

	let result = { params: uri.query };

	for (var i = 0; i < pathname.length; i++) {

		result[curl[i]] = pathname[i];
	}

	if(Number.isInteger(+uri.query.language_id) && (+uri.query.language_id <=2 && +uri.query.language_id >=1)){

		language_id = uri.query.language_id;

	}else if(uri.pathname === '/api/seo/get'){

		let _search = uri.search.substring(1);

		let _params = JSON.parse('{"' + _search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) { return key === "" ? value : decodeURIComponent(value) });

		language_id = (_params.link.split('/')[1] == 'en') ? 2 : 1;

	}


	if (result.folder != 'public' && result.folder != 'uploads' && uri.pathname != '/favicon.ico' ) {

		const request = {

			token: uri.query['mask'] || '',

			params: uri.query,

			data: req.body.data || null,

			auth: req.body.auth || null,

			module: postgres,

			crypto: crypto,

			lang: language,

			language_id: language_id,

			config: config,

			Date: {

				datetime: (e = "") => {
					e = e ? (typeof e === 'object' ? e : new Date(e)) : new Date();
					return e.getFullYear() + '-' + (e.getMonth() + 1).toString() + '-' + e.getDate() + ' ' + e.getHours() + ':' + e.getMinutes() + ':' + e.getSeconds();
				},
				date: (e) => {
					e = e ? (typeof e === 'object' ? e : new Date(e)) : new Date();
					return e.getFullYear() + '-' + (e.getMonth() + 1).toString() + '-' + e.getDate()
				},
				time: (e) => {
					e = e ? (typeof e === 'object' ? e : new Date(e)) : new Date();
					return e.getHours() + ':' + e.getMinutes().toString() + ':' + e.getSeconds();
				},
			},

			translate: (message, data) => {

				let field = message.match(/(?!\{\{})(\w+)(?=\}\})/g);

				if (field.length > 0) {

					for (let i = 0; i < field.length; i++) {

						let key = (data.hasOwnProperty(field[i])) ? data[field[i]] : field[i];

						let search = "{{" + field[i] + "}}";

						message = message.replace(new RegExp(search, 'g'), key);

					}

				}

				return message;

			},

			toslug: (string = "") => {
				if (!string || string == null || string === 'undefined') {
					return ""
				};

				let slug = string.toString().toLowerCase();
				slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
				slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
				slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
				slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
				slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
				slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
				slug = slug.replace(/đ/gi, 'd');
				slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
				return slug;
			},

			success: (message = "", data = "") => {

				res.json({ token: request.token, status: 1, message: (message && message != null) ? message : language.success, data: (data) ? data : {} });

				res.end();
			},

			failure: (message = "", data = "") => {

				res.json({ token: request.token, status: 0, message: (message && message != null) ? message : language.failure, data: (data) ? data : {} });

				res.end();
			},

			response: (message = "", data = "") => {

				res.json({ message: (message && message != null) ? message : language.success, data: (data) ? data : {} });

				res.end();
			},

			getusers: () => {

				return userInConnect;

			},

			usesession: (data) => {

				if (!userInConnect) { userInConnect = {}; }

				userInConnect[data.id] = data;

				return true;
			},
			
			removesession: (id) => {

				if (userInConnect[id]) {

					delete userInConnect[id];

				}
			},
			checksession: (data, token) => {

				if (userInConnect[data.id] && data.length > 0) {

					if (userInConnect[data.id].client.indexOf(socket.id) === -1) {

						userInConnect[data.id].client.push(socket.id);

					}
				} else {

					data.client = [socket.id];

					request.usesession(data);

				}

				return (userInConnect) ? (userInConnect[data.id] ? (userInConnect[data.id].token === token ? true : false) : false) : false;
			},

			logout: () => {

				findIndexOf(socket.id);
			}
		};

		let flagSkip = uri.pathname.split('/')[1] == 'api' || uri.pathname.split('/')[1] == 'browsers' ? true : false;
			
		if(uri.pathname.split('/')[1] != 'api' && uri.pathname.split('/')[1] != 'browsers'){

			let token_user = (req.body) ? (req.body.auth ? req.body.auth.token : '') : ''  || '';

			flagSkip = token_user != '' ? await _token.checkToken(token_user, { module : postgres}) : false;
		}

		if(flagSkip){

			try {

				const request = {

					token: uri.query['mask'] || '',

					params: uri.query,

					data: req.body.data || null,

					auth: req.body.auth || null,

					module: postgres,

					crypto: crypto,

					lang: language,

					language_id: language_id,

					config: config,

					Date: {

						datetime: (e = "") => {
							e = e ? (typeof e === 'object' ? e : new Date(e)) : new Date();
							return e.getFullYear() + '-' + (e.getMonth() + 1).toString() + '-' + e.getDate() + ' ' + e.getHours() + ':' + e.getMinutes() + ':' + e.getSeconds();
						},
						date: (e) => {
							e = e ? (typeof e === 'object' ? e : new Date(e)) : new Date();
							return e.getFullYear() + '-' + (e.getMonth() + 1).toString() + '-' + e.getDate()
						},
						time: (e) => {
							e = e ? (typeof e === 'object' ? e : new Date(e)) : new Date();
							return e.getHours() + ':' + e.getMinutes().toString() + ':' + e.getSeconds();
						},
					},

					translate: (message, data) => {

						let field = message.match(/(?!\{\{})(\w+)(?=\}\})/g);

						if (field.length > 0) {

							for (let i = 0; i < field.length; i++) {

								let key = (data.hasOwnProperty(field[i])) ? data[field[i]] : field[i];

								let search = "{{" + field[i] + "}}";

								message = message.replace(new RegExp(search, 'g'), key);

							}

						}

						return message;

					},

					toslug: (string = "") => {
						if (!string || string == null || string === 'undefined') {
							return ""
						};

						let slug = string.toString().toLowerCase();
						slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
						slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
						slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
						slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
						slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
						slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
						slug = slug.replace(/đ/gi, 'd');
						slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
						return slug;
					},

					success: (message = "", data = "") => {

						res.json({ token: request.token, status: 1, message: (message && message != null) ? message : language.success, data: (data) ? data : {} });

						res.end();
					},

					failure: (message = "", data = "") => {

						res.json({ token: request.token, status: 0, message: (message && message != null) ? message : language.failure, data: (data) ? data : {} });

						res.end();
					},

					response: (message = "", data = "") => {

						res.json({ message: (message && message != null) ? message : language.success, data: (data) ? data : {} });

						res.end();
					},


					getusers: () => {

						return userInConnect;

					},
					usesession: (data) => {

						if (!userInConnect) { userInConnect = {}; }

						userInConnect[data.id] = data;

						return true;
					},
					removesession: (id) => {

						if (userInConnect[id]) {

							delete userInConnect[id];

						}
					},
					checksession: (data, token) => {

						if (userInConnect[data.id] && data.length > 0) {

							if (userInConnect[data.id].client.indexOf(socket.id) === -1) {

								userInConnect[data.id].client.push(socket.id);

							}
						} else {

							data.client = [socket.id];

							request.usesession(data);

						}

						return (userInConnect) ? (userInConnect[data.id] ? (userInConnect[data.id].token === token ? true : false) : false) : false;
					},

					logout: () => {

						findIndexOf(socket.id);
					}
				};


				let _path = './' + _mask + '/' + result.folder + '/' + result.file + '.component';
		
				try {
					const controllers = require(path.resolve(_path))(request, req);
					controllers[result['action']]();
				}
				catch (e) {

					console.log(e)
				}


			} catch (err) {

				console.log(err);
			}

		} else {

			res.json({ token: request.token ? request.token : '' , status: 0, message: language.failure, data:  {} });

			res.end();
		}
	} 



	// function findIndexOf(value) {

	// 	let data = Object.values(userInConnect);

	// 	for (let i = 0; i < data.length; i++) {

	// 		let indexUser = userInConnect[data[i].id].client.indexOf(value);

	// 		if (indexUser >= 0) {

	// 			userInConnect[data[i].id].client.splice(indexUser, 1);

	// 			if (userInConnect[data[i].id].client.length === 0) {

	// 				delete userInConnect[data[i].id];
	// 			}

	// 			break;

	// 		}
	// 	}

	// }
}