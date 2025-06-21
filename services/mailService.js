const nodemailer = require('nodemailer');
const { injectVariables } = require('../utils/variableParser');

exports.sendMail = async ({ from, appPassword, to, subject, body, variables }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: from,
      pass: appPassword,
    },
  });

  const parsedSubject = injectVariables(subject, variables);
  const parsedBody = injectVariables(body, variables);

  return transporter.sendMail({
    from,
    to,
    subject: parsedSubject,
    text: parsedBody,
  });
};
