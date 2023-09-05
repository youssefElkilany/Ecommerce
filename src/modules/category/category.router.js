import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import subctegoryRouter from "../subcategory/subcategory.router.js"
const router = Router({mergeParams:true})

router.use('/:categoryId/subCategory',subctegoryRouter)

router.get("/",categoryController.Categories)

router.get("/id/:_id",categoryController.categorybyid)

router.get("/virtual",categoryController.Categories2)

router.post('/',
    fileUpload(fileValidation.image).single('image'),
    validation(Val.addCategoryVal),
    asyncHandler(categoryController.addCategory)
)
router.put('/',
    fileUpload(fileValidation.image).single('image'),
   // validation(Val.updateCategoryVal),
    asyncHandler(categoryController.updateCategory)
)
router.put('/2',
    fileUpload(fileValidation.image).single('image'),
   // validation(Val.updateCategoryVal),
    asyncHandler(categoryController.updateCategory2)
)


router.delete('/:categoryId',
    validation(Val.deleteCategoryVal),
    asyncHandler(categoryController.deleteCategory)
)

router.get('/search'//,validation(Val.searchCategoryVal)
, categoryController.searchCategory)


export default router