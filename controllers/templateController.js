const Template = require('../models/template');
const { extractVariables } = require('../validators/templateValidator');


const createTemplate = async (req, res) => {
  try {
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ message: 'Subject and body are required.' });
    }

    const variables = [...new Set([
      ...extractVariables(subject),
      ...extractVariables(body),
    ])];

    const newTemplate = await Template.create({ subject, body, variables });

    res.status(201).json({ message: 'Template created', template: newTemplate });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createTemplate,
};
