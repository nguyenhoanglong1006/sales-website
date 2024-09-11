const sanitizeHtml = require('sanitize-html');

const nodemailer = require('nodemailer');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./customer.module')(req);

        const _component = {

            config: require('../settings/email.component')(req, io)
        }

        _this.addcustomer = async () => {

            let id = +req.params.id || 0;

            let data = req.data || {};

            let skip = false; let message = _lang.failure;

            let resultLogin;

            if (Object.keys(data).length > 0) {

                data.maker_date = req.Date.datetime();

                data.password = id > 0 ? data.password : req.crypto.encrypt(data.password);

                if (id == 0) {

                    data.token = req.crypto.hashToken(data.password);
                }

                if (data.avatar) {

                    data.avatar = files(data.avatar);
                }

                let checkProcess = await _module.checkProcessEmail(data.email, id);

                if (checkProcess[0]['count'] == 0) {

                    let result = await _module.process(data, id);

                    if (result.rowCount > 0) {

                        id = (id == 0) ? result.insertId : id;

                        resultLogin = await _module.checkProcessLogin(data.email, data.password);

                        skip = true;
                    }

                } else {

                    message = _lang.emailExist;
                }
            }

            skip == true ? req.success(null, resultLogin) : req.failure(message);
        }

        _this.login = async () => {

            let data = (req.data) ? req.data : {};

            if (data.email && data.password) {

                data.password = req.crypto.encrypt(data.password);

                let result = await _module.checkProcessLogin(data.email, data.password);

                if (result.length == 1) {

                    result = result[0];

                    let resultId = await _module.checkEmail(data.email);

                    result.info_id = req.crypto.hashToken(resultId[0].id.toString());

                    req.success(_lang.loginSuccess, result);

                } else {

                    req.failure(_lang.loginFailure);

                }

            } else {

                req.failure(_lang.loginFailure);

            }
        }

        _this.getorderlist = async () => {

            let id = req.params.data;

            let result = await _module.getOrderList(id);

            req.success(null, result);

        }

        _this.getcustomer = async () => {

            let email = req.params.data;

            let result = await _module.getCustomer(email);

            req.success(null, (result && result.length > 0) ? result[0] : {});

        }

        _this.changepass = async () => {

            let old_pass = req.crypto.encrypt(req.data.old_pass);

            let pass = req.crypto.encrypt(req.data.pass);

            let id = req.data.id

            let result = await _module.checkPass(old_pass, id);

            if (result.length == 1) {

                let result1 = await _module.changePass(pass, id);

                if (result1.rowCount > 0) {

                    req.success(_lang.changeSuccess, result1);
                }
                else {

                    req.failure(_lang.failure);

                }

            } else {

                req.failure(_lang.invalidOldPass);

            }
        }

        _this.processinfo = async () => {

            let id = req.data.id;

            let data = req.data || {};

            let skip = false; let message = _lang.failure;

            if (Object.keys(data).length > 0) {

                data.maker_date = req.Date.datetime();

                data.password = id > 0 ? data.password : req.crypto.encrypt(data.password);

                if (id == 0) {

                    data.token = req.crypto.hashToken(data.password);
                }

                if (data.avatar) {

                    // data.avatar = files(data.avatar);
                }

                let result = await _module.process(data, id);

                if (result.rowCount > 0) {

                    id = (id == 0) ? result.insertId : id;

                    skip = true;
                }

            }

            skip == true ? req.success() : req.failure(message);
        }

        _this.addorder = async () => {

            order = req.data.cart

            orderDetail = req.data.cartDetail

            customer = req.data.customer

            order['customer_id'] = customer.id

            order['customer_address'] = customer.address

            order['phone'] = customer.phone

            order['name'] = customer.name

            order['email'] = customer.email

            order['maker_date'] = req.Date.datetime();

            order['delivery_status'] = 0

            let skip = false

            let result = await _module.addOrder(order);

            let code = result.rows[0].code

            if (result.rowCount > 0) {

                let order_id = result.rows[0].id

                for (let i = 0; i < orderDetail.length; i++) {

                    orderDetail[i].order_id = order_id

                    let resultDetail = await _module.addOrderDetail(orderDetail[i])

                    if (resultDetail.rowCount > 0) {

                        skip = true
                    }
                }
            }


            let configMail = await _component.config.getConfigMail();

            let config = {

                pool: true,

                host: configMail.server || '',

                port: configMail.port || 25,

                secure: (configMail.port == 465) ? true : false,

                auth: {

                    user: configMail.email,

                    pass: configMail.password

                }
            };

            var transporter = nodemailer.createTransport(config);

            var mailOptions = {

                from: configMail.email,

                to: configMail.email,

                subject: "Thông báo Đơn hàng",
                
                html: `<h1>Thông báo đơn hàng</h1
                    <p>Hệ thống đã tiếp nhận đơn hàng. Mã đơn hàng: ${code}</p>
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
            
            skip == true ? req.success(_lang.orderSuccess, code) : req.failure(_lang.failure);

        }
    }
}