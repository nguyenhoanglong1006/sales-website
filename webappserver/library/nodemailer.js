const nodemailer   = require('nodemailer');

module.exports  =  nodemailer.createTestAccount((err, account , mailOptions) => {

		let transporter = nodemailer.createTransport({

	        host: account.server,

	        port: account.port,

	        secure: (account.port == 465) ? true : false, 

	        auth: {

	            user: account.username, 

	            pass: account.password 

	        }
	    });
	
	    transporter.sendMail(mailOptions, (error, info) => {

	        if (error) {  return console.log(error); }
	        
	        console.log('Message sent: %s', info.messageId);
	        // Preview only available when sending through an Ethereal account
	        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	    });
	})