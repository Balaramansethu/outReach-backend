const injectVariables = (template, variables) => {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => variables[key] || '');
};

module.exports = {
  injectVariables
};