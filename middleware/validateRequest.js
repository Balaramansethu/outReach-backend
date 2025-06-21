const { setResponseBody } = require("../utils/responseFormatter")

const validateRequest = (schema) => {
    return (request, response, next) => {
        const { error } = schema.validate(request.body)

        if (error) {
            response
                .status(400)
                .send(
                    setResponseBody(
                        error.details[0].message,
                        "validation_error",
                        null
                    )
                )
            return
        }

        next()
    }
}

module.exports = validateRequest
