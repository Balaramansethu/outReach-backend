const { setResponseBody } = require("../utils/responseFormatter")
const { generateToken, setTokenCookie } = require("../services/tokenService.js")
const {
    createUserInDB,
    findUserByEmailFromDB,
    findUserByEmailWithPasswordFromDB,
} = require("../repositories/userRepository")
const { validatePassword } = require("../services/userService")

const signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const existingUser = await findUserByEmailFromDB(email)
        if (existingUser) {
            res.status(409).send(
                setResponseBody(
                    "Email id already exist",
                    "existing_email",
                    null
                )
            )
            return
        }

        const newUserData = {
            name,
            email,
            password,
        }

        const userToBeRegistered = await createUserInDB(newUserData)

        const token = generateToken(userToBeRegistered)
        setTokenCookie(res, token)

        const {
            password: _,
            __v: __,
            _id: ___,
            ...userData
        } = userToBeRegistered._doc

        res.status(201).send(
            setResponseBody("User Created Successfully", null, userData)
        )
    } catch (error) {
        console.log(error)
        res.status(500).send(
            setResponseBody(
                error.message || String(error),
                "server_error",
                null
            )
        )
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const existingUser = await findUserByEmailWithPasswordFromDB(email)

        if (!existingUser) {
            res.status(401).send(
                setResponseBody("Invalid email address", "invalid_email", null)
            )
            return
        }

        const validPassword = await validatePassword(
            password,
            existingUser.password
        )
        if (!validPassword) {
            res.status(401).send(
                setResponseBody("Invalid password", "invalid_password", null)
            )
            return
        }

        const {
            password: _,
            _id,
            __v,
            createdAt,
            updatedAt,
            ...userData
        } = existingUser._doc

        const token = generateToken(existingUser)
        setTokenCookie(res, token)

        res.status(200).send(
            setResponseBody("Logged in Successfully", null, userData)
        )
    } catch (error) {
        res.status(500).send(
            setResponseBody(
                error.message || String(error),
                "server_error",
                null
            )
        )
    }
}

module.exports = {
    signup,
    login,
}
