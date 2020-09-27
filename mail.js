//const nodemailer = require('nodemailer');


//let transport = nodemailer.createTransport(options[, defaults]);


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kr151ranjan@gmail.com',
    pass: '27302811037'
  }
});

var mailOptions = {
  from: 'kr151ranjan@gmail.com',
  to: 'kr151ranjan@gmail.com',
  subject: 'Registeration mail',
  text: 'That was easy!',
  html: '<p>Click <a href="http://www.google.com">here</a> to reset your password</p>'
};



module.exports={transporter,mailOptions};
