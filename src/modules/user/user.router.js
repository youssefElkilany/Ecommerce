import { Router } from "express";
import * as usercontroller from './controller/user.js'
const router = Router()




router.get('/', usercontroller.getallusers)

//router.get()



export default router