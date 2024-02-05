import { Router } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { adminRole, isAuthenticated } from "../../middleware/auth";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../../controllers/categories";

const router = Router();
const validator = createValidator({});

const createCategorySchema = Joi.object({
    name: Joi.string().min(3).max(15).required(),
    image: Joi.string().required()
});


router.post("/create", validator.body(createCategorySchema), isAuthenticated, adminRole("admin"), createCategory);
router.get("/all-categories", isAuthenticated, getAllCategories);
router.put("/update-category/:id",  isAuthenticated, adminRole("admin"), updateCategory);
router.delete("/delete-category/:id",  isAuthenticated, adminRole("admin"), deleteCategory);

export default router;
