import { Router } from "express";
import * as productController from "./controller/product.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router()




router.get('/',productController.getproducts )
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

router.delete('/:_id',productController.deleteproduct)



export default router