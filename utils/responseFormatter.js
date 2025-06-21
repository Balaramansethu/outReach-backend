const setResponseBody = (message, error = null, data = null) => {
    return {
      message,
      error,
      data,
    };
  };
  
  module.exports = {
    setResponseBody
  };
  