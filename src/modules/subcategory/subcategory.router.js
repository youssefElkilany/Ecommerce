import { Router } from "express";
import * as subcategoryController from  './controller/subcategory.js'
import * as val from "./subcategory.validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { roles, validation } from "../../middleware/validation.js";
import auth from "../../middleware/auth.js";
const router = Router({mergeParams:true})





router.get('/', subcategoryController.SubCategories)
router.post("/:categoryId",auth([roles.admin]),fileUpload(fileValidation.image).single("image"),validation(val.addSubCategory),subcategoryController.addSubCategory)

router.delete("/:_id",validation(val.deleteSubCategory),subcategoryController.deleteSubCategory)

router.put("/",fileUpload(fileValidation.image).single('image'),validation(val.updateSubCategory),subcategoryController.updateSubCategory)

router.get("/search",validation(val.searchSubCategory),subcategoryController.searchByName)


export default router