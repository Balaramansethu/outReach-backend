const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  variables: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
