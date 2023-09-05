import { Router } from "express";
import * as cartcontroller from './controller/cart.js'
import * as val from './cart.validation.js'
import auth from "../../middleware/auth.js";
import { roles, validation } from "../../middleware/validation.js";
const router = Router()




// router.get('/', (req ,res)=>{
//     res.status(200).json({message:"Cart Module"})
// })

router.route('/')
.get(auth([roles.user]),cartcontroller.getUserCart)

.post(auth([roles.user]),validation(val.addtoCart),cartcontroller.addToCart)


router.route('/:product')
.delete(auth([roles.user]),validation(val.deleteFromCart),cartcontroller.deleteFromCart)



export default router