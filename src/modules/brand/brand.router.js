import { Router } from "express";
import * as brandController from "./controller/brand.js"
import * as val from "./brand.validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import auth from "../../middleware/auth.js"
import { roles, validation } from "../../middleware/validation.js";
const router = Router()



// router.get('/', subcategoryController.SubCategories)
// router.post("/:categoryId",fileUpload(fileValidation.file).single('image'),subcategoryController.addSubCategory)
// router.delete("/:_id",subcategoryController.deleteSubCategory)
// router.put("/",fileUpload(fileValidation.file).single('image'),subcategoryController.updateSubCategory)
// router.get("/search",subcategoryController.searchByName)



router.get('/',brandController.getbrands)
router.get('/id/:_id',auth([roles.admin]),validation(val.searchbyId),brandController.brandbyId)
router.get('/search',validation(val.searchbyName),brandController.searchbyName)


router.post("/",auth([roles.admin]),fileUpload(fileValidation.image).single('image'),validation(val.addbrand) ,brandController.addbrand)
router.put("/",auth([roles.admin]),fileUpload(fileValidation.image).single('image'),validation(val.updatebrand) ,brandController.updatebrand)
router.delete("/_id",auth([roles.admin]),validation(val.deletebrand),brandController.deletbrand)



export default router