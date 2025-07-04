const jwt = require("jsonwebtoken")
const { setResponseBody } = require("../utils/responseFormatter")
const { findUserByIdFromDB } = require("../repositories/userRepository")

const parseCookies = (cookieString) => {
    return cookieString.split(";").reduce((cookies, cookie) => {
        const [key, value] = cookie.split("=").map((item) => item.trim())
        cookies[key] = value
        return cookies
    }, {})
}

const verifyUser = async (request, response, next) => {
    try {
        const authHeader = request.headers["cookie"]
        if (!authHeader) {
            response
                .status(401)
                .send(
                    setResponseBody(
                        "Token not found",
                        "authentication_error",
                        null
                    )
                )
            return
        }

        const cookies = parseCookies(authHeader)
        const token = cookies.SessionID

        jwt.verify(token, process.env.ACCESS_TOKEN, async (error, decoded) => {
            if (
                error ||
                !decoded ||
                typeof decoded !== "object" ||
                !("id" in decoded)
            ) {
                response
                    .status(401)
                    .send(
                        setResponseBody(
                            "Session Expired",
                            "authentication_error",
                            null
                        )
                    )
                return
            }

            const { id } = decoded
            const user = await findUserByIdFromDB(id)

            request.user = {
                _id: id,
                email: user.email,
                role: user.role,
            }

            next()
        })
    } catch (error) {
        if (error instanceof Error) {
            response
                .status(500)
                .send(setResponseBody(error.message, "server_error", null))
        }

        response
            .status(500)
            .send(setResponseBody(String(error), "server_error", null))
    }
}

const verifyAdmin = (request, response, next) => {
    try {
        const { role } = request.user || {}

        if (role !== "admin") {
            response
                .status(403)
                .send(
                    setResponseBody(
                        "Access denied, admin privileges required.",
                        "authorization_failed",
                        null
                    )
                )
            return
        }

        next()
    } catch (error) {
        if (error instanceof Error) {
            response
                .status(500)
                .send(setResponseBody(error.message, "server_error", null))
        }

        response
            .status(500)
            .send(setResponseBody(String(error), "server_error", null))
    }
}

module.exports = {
    verifyUser,
    verifyAdmin,
}
