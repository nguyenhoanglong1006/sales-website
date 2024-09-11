const express = require('express');

const path = require('path');

const http = require('http');

const config = require('./config/config');

const bodyParser = require('body-parser');

const routes = require('./library/routes');

const uploadFroala = require('./library/froala/upload');

var cors = require('cors');

const ChipsWebService = function () {

	const _this = this;

	_this.app = express();

	_this.app.use(cors());

	_this.http = http.Server(_this.app);

	_this.app.use(bodyParser.json({ limit: '10mb', extended: true }));

	_this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

	_this.app.use(bodyParser.json());

	_this.app.use(bodyParser.raw());

	_this.app.use('/public', express.static(path.join(__dirname, 'public')));

	_this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

	_this.app.use(function (req, res, next) {

		let link = ['/image_upload', '/file_upload', '/video_upload', '/load_images', '/delete_image'];

		if (link.indexOf(req.url) != -1) {

			uploadFroala(req, res, req.url);

		} else {
			routes(req, res, next);
		}

	})

	const port = process.env.PORT || config.port;

	_this.app.set('port', port);

	_this.http.listen(port, () => console.log("Running on localhost:" + port));

}

const cws = new ChipsWebService();