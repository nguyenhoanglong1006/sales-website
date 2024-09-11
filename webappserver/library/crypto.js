const crypto = require('crypto-js');

const cryptoJs = function () {

	const _this = this;

	_this.token = 'CkEnNKtOX';

	_this.ramdom = (l) => {

		var t = "";

		var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,/?><|\"':;}{][+=_-)(*&^%$#@!~`";

		for (var i = 0; i < l; i++) {

			t += p.charAt(Math.floor(Math.random() * p.length));

		}

		return t;

	}

	_this.color = () => {

		let l = '0123456789ABCDEF';

		let c = '#';

		for (let i = 0; i < 6; i++) {

			c += l[Math.floor(Math.random() * 16)];

		}

		return c;

	}

	_this.hashToken = (v) => {

		let k = (new Date()).getTime().toString();

		let l = crypto.AES.encrypt(v, k).toString();

		let f = _this.token + k;

		let p = Math.floor(Math.random() * (l.length - 1));

		return l.substr(0, p) + f + l.substr(p, l.length);

	}

	_this.encrypt = (v) => {

		v = (typeof v === "object") ? JSON.stringify(v) : v;

		return crypto.SHA512(v + _this.token).toString().substr(0, 45);

	}

	_this.decrypt = (v) => {

		let e = v.indexOf(_this.token);

		let l = (new Date()).getTime().toString().length;

		let k = v.substr(e + _this.token.length, l);

		let d = v.substr(0, e) + v.substr(e + _this.token.length + l, v.length);

		let p = crypto.AES.decrypt(d, k);

		try {

			return p.toString(crypto.enc.Utf8);

		} catch (err) {

			console.log(err);

			return {};

		}

	}

}
module.exports = new cryptoJs();