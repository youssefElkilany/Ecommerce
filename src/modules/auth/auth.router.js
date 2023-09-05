import { Router } from "express";
import * as authController from './controller/registration.js'
import { roles } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
const router = Router()
//router.route('/')
router.post("/",authController.signUp)

router.get("/emailConfirmation/:emailtoken",authController.confrimEmail)

router.get("/newconfirmationemail/:emailtoken",authController.newConfirmationEmail)

router.post("/login",authController.login)
//option 2
router.post("/signup",authController.signup2)

router.post("/confirmemail",authController.confirmEmail2)

router.post("/forgetpass",authController.forgetpassword)

router.post("/sendcode",authController.sendCode)


export default router