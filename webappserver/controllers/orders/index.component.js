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

        _this.getitem = async () => {

            let id = (req.params.id && req.params.id > 0) ? req.params.id : 0;

            let result = await _module.getItem(id);

            req.success(null, result);

        }

        _this.changedeliverystatus = async () => {

            let id = +req.params.id || 0;

            if (id > 0) {

                let result = await _module.updateDeliveryStatus(id);

                (result.rowCount > 0) ? req.success(null, { id: id }) : req.failure();

            } else {

                req.failure();
            }
        }

        _this.sendmail = async () => {

            let id = req.params.id || 0;

            let sale = req.data || {};

            let data = await _module.getRow(id);

            data = (data && data.length > 0) ? data[0] : {};

            if (Object.keys(data).length > 0 && Object.keys(sale).length > 0) {

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

                    to: sale.email,

                    subject: "Thông báo Đơn hàng",

                    html: `
                    <h1>Thông báo đơn hàng</h1
                    <p>Hệ thống đã tiếp nhận đơn hàng. Mã đơn hàng: ${data.code}</p>
                    <p>Bạn hãy vào quản trị Website để kiểm tra</p>`
                }

                transporter.sendMail(mailOptions, (error, info) => {

                    if (error) {

                        req.failure(_lang.emailNotExist);

                        return console.log(error);

                    } else {

                        return true;

                    }

                });

                result = await req.module.asyncQuery(`UPDATE tb_orders SET sale_id = ${sale.id} WHERE id = $1 `, [id]);

                result.rowCount > 0 ? req.success('Đã thông báo thành công.') : req.failure();

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