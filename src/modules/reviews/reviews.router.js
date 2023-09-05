import { Router } from "express";
import * as reviewController from './controller/review.js'
import * as val from './reviews.validation.js'
import auth from "../../middleware/auth.js";
import { roles, validation } from "../../middleware/validation.js";
const router = Router()



router.route('/')
.get((req ,res)=>{
    res.status(200).json({message:"reviews Module"})
})

.post(auth([roles.user]),validation(val.reviewProduct),reviewController.rateOrder)

router.route('/:_id')
.put(auth([roles.user]),validation(val.updatereview),reviewController.updateReview)
.delete(auth([roles.user]),validation(val.deletereview),reviewController.deleteReview)



export default router