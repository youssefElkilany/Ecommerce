import { Router } from "express";
import * as productController from "./controller/product.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import { roles, validation } from "../../middleware/validation.js";
import * as val from "./product.validation.js"
const router = Router()




router.get('/',productController.getproducts )
//auth(roles.admin),

router.post("/add",auth(roles.admin),fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
    {name:'coverImages',maxCount:10}
]),validation(val.addProduct)
,productController.adddProduct)


router.put("/update",auth(roles.admin),fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
    {name:'coverImages',maxCount:10}
]),validation(val.updateProduct),
productController.updateProductt)


router.delete('/:_id',auth(roles.user),validation(val.deleteProduct),productController.deleteproduct)



export default router