const path = require('path');

const files = require(path.resolve('./library/upfile'));

const nodemailer = require('nodemailer');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./contactsale.module')(req);

        const _component = {

            config: require('../settings/email.component')(req, io)
        }

        _this.getlist = async () => {

            let result = await _module.getList();

            req.success(null, result);
        }

        _this.getrow = async () => {

            let id = req.params.id || 0;

            let result = await _module.getRow(id);

            result = result && result.length > 0 ? result[0] : {}

            req.success(null, result);
        }

        _this.changepassword = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false;

            if (Object.keys(data).length > 0 && id > 0) {

                let password = req.crypto.encrypt(data.password);

                let token = req.crypto.hashToken(data.password);

                let result = await _module.changePassword(password, token, id);

                if (result.rowCount > 0) {

                    skip = true;
                }
            }

            skip == true ? req.success(null, { skip: +id === +req.crypto.decrypt(req.auth.info_id) ? true : false }) : req.failure();
        }

        _this.process = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false; let message = _lang.failure;

            if (Object.keys(data).length > 0) {

                data.maker_date = req.Date.datetime();

                data.maker_id = req.crypto.decrypt(req.auth.info_id);

                if (data.avatar) {

                    data.avatar = files(data.avatar);
                }

                let checkProcess = await _module.checkProcessEmail(data.email, id);

                if (checkProcess[0]['count'] == 0) {

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0) ? result.insertId : id;

                        skip = true;
                    }

                } else {

                    message = _lang.emailExist;
                }
            }

            skip == true ? req.success() : req.failure(message);
        }

        _this.remove = async () => {

            let id = +req.params.id || 0;

            let skip = false;

            if (id > 0) {

                let result = await _module.remove(id);

                skip = +result.rowCount > 0 ? true : false;
            }

            skip == true ? req.success() : req.failure();
        }

        _this.mailsale = async () => {

            let data = (req.data) ? req.data : {};

            let checkEmailSale = await _module.checkEmailSale();

            for (i = 0; i < checkEmailSale.length; i++) {

                let email = checkEmailSale[i]

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
                let productsStr = '';
                for (let j = 0; j < data.cartDetail.length; j++) {
                    let product = await _module.getProduct(data.cartDetail[j].product_id);
                    productsStr += product[0].name + ' x ' + data.cartDetail[j].amount + '<br>' ;
                }

                var mailOptions = {

                    from: result.email,

                    to: email.email,

                    subject: 'Có đơn hàng mới',

                    html:
                        '<p>C&oacute; một đơn h&agrave;ng mới vừa được đặt.</p>' +
                        '<table style="width: 46%;">' +
                        '<tbody>' +
                        '<tr>' +
                        '<td style="vertical-align: text-top!important;"><strong>Th&ocirc;ng tin kh&aacute;ch h&agrave;ng:</strong>' + '<br>' +
                        '<strong>T&ecirc;n kh&aacute;ch h&agrave;ng:&nbsp; </strong><br>' + data.customer.name + '<br>' +
                        '<strong>Địa chỉ: </strong><br>' + data.customer.address + '<br>' +
                        '<strong>Số điện thoại:</strong><br>' + data.customer.phone + '<br>' +
                        '<br>' +
                        '<br>' +
                        '</td>' +
                        '<td style="width: 50%;border: 1px solid #d2c8c8;"><strong>Chi tiết đơn h&agrave;ng:</strong>' + '<br>' +
                        '<span>' + productsStr + '</span>' +
                        '<strong>Tổng tạm t&iacute;nh:</strong> <br>' + data.cart.total_price.toLocaleString(data.cart.total_price == 'VND' ? 'vi' :'en', {maximumFractionDigits: 5}) +
                        '<br>' +
                        '<strong>Giảm gi&aacute;:</strong> <br>' + data.cart.total_sale.toLocaleString(data.cart.total_sale == 'VND' ? 'vi' :'en', {maximumFractionDigits: 5}) +
                        '<br>' +
                        '<strong>Tổng cộng:</strong> <br>' + data.cart.total_payment.toLocaleString(data.cart.total_payment == 'VND' ? 'vi' :'en', {maximumFractionDigits: 5}) +
                        '<br>' +
                        '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>'
                }


                transporter.sendMail(mailOptions, (error, info) => {

                    if (error) {

                        req.failure(_lang.emailNotExist);

                        return console.log(error);

                    } else {

                        req.success(_lang.getOtpEmail);

                    }

                });
            }

        }
    }
}