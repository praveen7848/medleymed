const nodemailer = require('nodemailer');

var sendEmail = function (toEmail, subject, messageBody,attachmentData) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "medley11109@gmail.com",
      pass: "Medley@123",
    },
  });

  let mailOptions = {
    from: "medley11109@gmail.com",
    to: toEmail,
    subject: subject,
    html: messageBody,
    attachments:attachmentData
  };

  let info = transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
  
};

var sendEmailPassword = function (toEmail, subject, messageBody) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "medley11109@gmail.com",
      pass: "Medley@123",
    },
  });
  let mailOptions = {
    from: "medley11109@gmail.com",
    to: toEmail,
    subject: subject,
    html: messageBody  
  };
  let info = transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } 
    // else {
    //   console.log(info);
    // }
  });
  
};
module.exports.sendEmail = sendEmail;
module.exports.sendEmailPassword=sendEmailPassword;
