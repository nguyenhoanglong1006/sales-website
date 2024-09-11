const nodemailer = require('nodemailer');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _module = require('./index.module')(req);

        const _lang = (req.lang) ? req.lang : {};

        const _component = {

            config: require('../settings/email.component')(req, io)
        }

        _this.getlist = async () => {

            let result = await _module.getList();

            req.success(null, result);

        }

        _this.getrow = async () => {

            let id = (req.params.id && req.params.id > 0) ? req.params.id : 0;

            let result = await _module.getRow(id);

            req.success(null, (result && result.length > 0) ? result[0] : {});

        }

        _this.process = async () => {

            let data = req.data;

            let id = req.params.id || 0;

            if (Object.keys(data).length > 0) {

                data['checked'] = 1;

                data['maker_id'] = req.crypto.decrypt(req.auth.info_id);

                data['day_send'] = req.Date.datetime();

                let result = await _component.config.getConfigMail();

                let config = {

                    pool: true,

                    host: result.server || '',

                    port: result.port || 25,

                    secure: (result.port == 465) ? true : false,

                    auth: {

                        user: result.email,

                        pass: result.password

                    }
                };


                var transporter = nodemailer.createTransport(config);


                var mailOptions = {

                    from: result.email,

                    to: data.email,

                    subject: data.subject_send,

                    html: data.message_send

                }

                transporter.sendMail(mailOptions, (error, info) => {

                    if (error) {

                        req.failure(_lang.emailNotExist);

                        return console.log(error);

                    } else {

                        return true;

                    }

                });

                result = await _module.process(data, id);

                result.rowCount > 0 ? req.success(_lang.replySuccess) : req.failure();

            } else {

                req.failure();
            }
        }

        _this.remove = async () => {

            let id = (req.params.id && req.params.id > 0) ? req.params.id : 0;

            let result = await _module.process({ status: 0 }, id);

            result.rowCount > 0 ? req.success() : req.failure();
        }
    }
}