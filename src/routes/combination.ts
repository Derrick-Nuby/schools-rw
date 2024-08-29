import { Router } from "express";
import { getAllCombinations, getSingleCombination, createCombination, updateCombination, deleteCombination } from "../controllers/combination.js";
import { validateCombination, validateUpdateCombination } from "../middleware/combinationValidation.js";
import { adminAuthJWT, userAuthJWT } from '../middleware/auth.js';

const router: Router = Router();

router.get("/", getAllCombinations);
router.get("/:id", getSingleCombination);
router.post("/", validateCombination, adminAuthJWT, createCombination);
router.put("/:id", validateUpdateCombination, adminAuthJWT, updateCombination);
router.delete("/:id", adminAuthJWT, deleteCombination);

export default router;
