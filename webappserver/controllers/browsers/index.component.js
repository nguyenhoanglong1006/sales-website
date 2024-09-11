const nodemailer = require('nodemailer');

module.exports = (req, io) => {

    return new function () {

        const _this = this;

        const _lang = (req.lang) ? req.lang : {};

        const _module = require('./index.module')(req);

        const _component = {
            config: require('../settings/email.component')(req, io)
        }

        _this.checklogin = async () => {

            let data = req.data || {};

            let result = await _module.checkProcessLogin(data.email, data.password, data.token);
            
            if (result.length == 1) {
                
                result = result[0]

                result.info_id = req.crypto.hashToken(result.id.toString());

                req.success(_lang.loginSuccess,result);

            } else {

                req.failure(_lang.loginFailure);
            }
        }

        _this.login = async () => {

            let data = (req.params) ? req.params : {};

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

        _this.forget = async () => {

            let data = (req.data) ? req.data : {};

            let checkEmail = await _module.checkEmail(data.email);

            if (checkEmail.length > 0) {

                let getOtp = await _module.getOtp(checkEmail[0].id);

                let OtpId = (getOtp && getOtp.length > 0) ? getOtp[0].id : 0;

                let otp = Math.floor(100000 + Math.random() * 900000);

                let processOtp = await _module.processOtp({
                    otp: otp,
                    user_id: checkEmail[0].id > 0 ? checkEmail[0].id : '',
                    status: 1,
                    maker_date: req.Date.datetime()
                }, OtpId);

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

                    subject: 'Mã xác thực C-OTP',

                    html: '<p> C-' + otp + ' Là mã C-OTP xác thực của bạn.</p>'

                }

                transporter.sendMail(mailOptions, (error, info) => {

                    if (error) {

                        req.failure(_lang.emailNotExist);

                        return console.log(error);

                    } else {

                        req.success(_lang.getOtpEmail);

                    }

                });

            } else {

                req.failure(_lang.emailNotExist);

            }

        }

        _this.forgetcustomer = async () => {

            let data = (req.data) ? req.data : {};

            let checkEmailCustomer = await _module.checkEmailCustomer(data.email);

            if (checkEmailCustomer.length > 0) {

                let getOtp = await _module.getOtp(checkEmailCustomer[0].id);

                let OtpId = (getOtp && getOtp.length > 0) ? getOtp[0].id : 0;

                let otp = Math.floor(100000 + Math.random() * 900000);

                let processOtp = await _module.processOtp({
                    otp: otp,
                    customer_id: checkEmailCustomer[0].id > 0 ? checkEmailCustomer[0].id : '',
                    status: 1,
                    maker_date: req.Date.datetime()
                }, OtpId);

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

                    subject: 'Mã xác thực C-OTP',

                    html: '<p> C-' + otp + ' Là mã C-OTP xác thực của bạn.</p>'

                }

                transporter.sendMail(mailOptions, (error, info) => {

                    if (error) {

                        req.failure(_lang.emailNotExist);

                        return console.log(error);

                    } else {

                        req.success(_lang.getOtpEmail);

                    }

                });

            } else {

                req.failure(_lang.emailNotExist);

            }

        }
        
        _this.otpcheck = async () => {

            let data = (req.data) ? req.data : {};

            let checkOtp = await _module.otpCheck(data.email, data.otp);

            if (checkOtp[0].count > 0) {

                req.success();

            } else {

                req.failure(_lang.otpNotExist);

            }
        }

        _this.otpcheckcustomer = async () => {

            let data = (req.data) ? req.data : {};

            let checkOtp = await _module.otpCheckCustomer(data.email, data.otp);

            if (checkOtp[0].count > 0) {

                req.success();

            } else {

                req.failure(_lang.otpNotExist);

            }
        }

        _this.resetpassword = async () => {

            // let his = { tables: ['tb_accounts'], container: null, data: null, type: 'chagepass' };

            let data = req.data || {};

            let info = await _module.getRowByEmail(data.email);

            if (info.length > 0) {

                let id = info[0].id || 0;

                // his.container = info;

                data.password = req.crypto.encrypt(data.password);

                data.token = req.crypto.hashToken(data.password);

                // his.data = data;

                let result = await _module.process(data, id);

                if (result.rowCount > 0) {

                    // req.history(his);

                    req.success(_lang.resetPasswordDone);

                } else {

                    req.failure();
                }
            } else {
                req.failure();
            }
        }

        _this.resetcustomerpassword = async () => {

            // let his = { tables: ['tb_accounts'], container: null, data: null, type: 'chagepass' };

            let data = req.data || {};

            let info = await _module.getRowByCustomerEmail(data.email);

            if (info.length > 0) {

                let id = info[0].id || 0;

                // his.container = info;

                data.password = req.crypto.encrypt(data.password);

                data.token = req.crypto.hashToken(data.password);

                // his.data = data;

                let result = await _module.processCustomer(data, id);

                if (result.rowCount > 0) {

                    // req.history(his);

                    req.success(_lang.resetPasswordDone);

                } else {

                    req.failure();
                }
            } else {
                req.failure();
            }
        }

        _this.logout = async () => {

            let id = req.params.id;

            req.removesession(id);

        }

        _this.checkToken = async (token, request) => {

            let result = await _module.getTokenUser(token, request);

            return result.length > 0 ? true : false;

        }
    }
}