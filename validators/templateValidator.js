const extractVariables = (text) => {
  const matches = text.match(/{{\s*([\w]+)\s*}}/g);
  return matches ? [...new Set(matches.map(v => v.replace(/{{\s*|\s*}}/g, '')))] : [];
};

module.exports = {
  extractVariables
};