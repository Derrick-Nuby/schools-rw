import { Router } from "express";
import { getAllCategories, getSingleCategory, createCategory, updateCategory, deleteCategory } from "../controllers/category.js";
import { validateCategory, validateUpdateCategory } from "../middleware/categoryValidation.js";
import { adminAuthJWT, userAuthJWT } from '../middleware/auth.js';

const router: Router = Router();

router.get("/", getAllCategories);
router.get("/:id", getSingleCategory);
router.post("/", adminAuthJWT, validateCategory, createCategory);
router.put("/:id", adminAuthJWT, validateUpdateCategory, updateCategory);
router.delete("/:id", adminAuthJWT, deleteCategory);

export default router;
