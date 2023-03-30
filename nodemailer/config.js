var nodemailer = require("nodemailer");
module.exports = async (email, name, id, token, type) => {
  console.log(email);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    secure: "true",
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
    },
  });
  const mailOptions = {
    from: process.env.Email, // sender address
    to: email, // list of receivers
    subject: `Email ${
      type == "verfiy" ? `verification` : `forget password`
    }  tagra softwares `, // Subject line
    html: `<h3>hi ${name}</h3>,
    <h4>   ${process.env.Orgin}/${type}?u=${id}&t=${token}<h4>
      `, // plain text body
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    // else console.log(info);
  });
};
