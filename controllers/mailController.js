const mailService = require('../services/mailService');

exports.sendEmail = async (req, res) => {
  const { from, appPassword, to, subject, body, variables } = req.body;

  if (!from || !appPassword || !to || !subject || !body || !variables) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    await mailService.sendMail({ from, appPassword, to, subject, body, variables });
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Send mail error:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};
