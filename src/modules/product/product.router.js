import { Router } from "express";
import * as productController from "./controller/product.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js";
import { roles } from "../../middleware/validation.js";
const router = Router()




router.get('/',productController.getproducts )
//auth(roles.admin),
router.post("/add",auth(roles.admin),fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
    {name:'coverImages',maxCount:10}
]),
productController.adddProduct)

router.put("/update",auth(roles.admin),fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
    {name:'coverImages',maxCount:10}
])
,productController.updateProductt)

router.post("/",fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
    {name:'coverImages',maxCount:10}
]),
productController.addProduct)

router.put("/",fileUpload(fileValidation.image).fields([
    {name:'image',maxCount:1},
    {name:'coverImages',maxCount:10}
])
,productController.updateProduct)

router.delete('/:_id',auth(roles.user),productController.deleteproduct)



export default router