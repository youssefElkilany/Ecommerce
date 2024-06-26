import express,{ Router } from "express";
import * as orderController from './controller/Order.js'
import * as val from './order.validation.js'
import auth from "../../middleware/auth.js";
import { roles, validation } from "../../middleware/validation.js";
const router = Router()



router.route('/')//roles.user
.get(auth([roles.user]),orderController.getOrderByUserId)
.post(auth(roles.admin),validation(val.addOrder),orderController.addOrder)
 

router.get('/successOrder/:successToken',orderController.successUrl)
router.post('/webhook', express.raw({type: 'application/json'}),orderController.webhookOriginal) 


export default router