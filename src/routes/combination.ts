import { Router } from "express";
import { getAllCombinations, getSingleCombination, createCombination, updateCombination, deleteCombination } from "../controllers/combination.js";
import { validateCombination, validateUpdateCombination } from "../middleware/combinationValidation.js";
// import { adminAuthJWT, userAuthJWT } from '../middleware/auth.js';

const router: Router = Router();

router.get("/", getAllCombinations);
router.get("/:id", getSingleCombination);
router.post("/", validateCombination, createCombination);
router.put("/:id", validateUpdateCombination, updateCombination);
router.delete("/:id", deleteCombination);

export default router;
