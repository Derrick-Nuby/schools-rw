import { Router } from "express";
import { getAllCategories, getSingleCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.js";
import { validateCategory, validateUpdateCategory } from "../middleware/categoryValidation.js";
// import { adminAuthJWT, userAuthJWT } from '../middleware/auth.js';

const router: Router = Router();

router.get("/", getAllCategories);
router.get("/:id", getSingleCategory);
router.post("/", validateCategory, createCategory);
router.put("/:id", validateUpdateCategory, updateCategory);
router.delete("/:id", deleteCategory);

export default router;
