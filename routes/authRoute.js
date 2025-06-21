const express = require("express")
const router = express.Router()

const { login, signup } = require("../controllers/authController")
const validateRequest = require("../middleware/validateRequest.js")
const { loginSchema, signupSchema } = require("../validators/userValidator.js")

router.post("/signup", validateRequest(signupSchema), signup)

router.post("/login", validateRequest(loginSchema), login)

module.exports = router
