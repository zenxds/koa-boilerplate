const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')
const mailConfig = require('config').get('mail')
const htmlTpl = fs.readFileSync(path.join(__dirname, 'template.txt'), 'utf8')

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: mailConfig.user,
    pass: mailConfig.password,
  },
})

module.exports = {
  /**
   * options: to, appname, error
   */
  send: options => {
    const mailOptions = {
      from: mailConfig.from,
      to: options.to,
      subject: options.subject,
      html: substitute(htmlTpl, {
        detail: options.detail,
      }),
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      }
    })
  },
}

function substitute(str, o) {
  return str.replace(/\\?\{\{\s*([^{}\s]+)\s*\}\}/g, function (match, name) {
    if (match.charAt(0) === '\\') {
      return match.slice(1)
    }
    return o[name] == null ? '' : o[name]
  })
}
