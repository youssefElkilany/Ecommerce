import { Router } from "express";
import * as subcategoryController from  './controller/subcategory.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
const router = Router({mergeParams:true})





router.get('/', subcategoryController.SubCategories)
router.post("/:categoryId",fileUpload(fileValidation.image).single("image"),subcategoryController.addSubCategory)
router.delete("/:_id",subcategoryController.deleteSubCategory)
router.put("/",fileUpload(fileValidation.image).single('image'),subcategoryController.updateSubCategory)
router.get("/search",subcategoryController.searchByName)


export default router