const Template = require('../models/template');

const extractVariables = (text) => {
  const matches = text.match(/{{\s*([\w]+)\s*}}/g);
  return matches ? [...new Set(matches.map(v => v.replace(/{{\s*|\s*}}/g, '')))] : [];
};

exports.createTemplate = async (req, res) => {
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
