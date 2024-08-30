import { Router } from "express";
import { getAllSchools, getSingleSchool, createSchool, updateSchool, deleteSchool, searchSchool } from "../controllers/school.js";
import { validateSchool, validateUpdateSchool } from "../middleware/schoolValidation.js";
import { adminAuthJWT, userAuthJWT } from '../middleware/auth.js';

const router: Router = Router();

router.get("/", getAllSchools);
router.get("/search", searchSchool);
router.get("/:id", getSingleSchool);
router.post("/", adminAuthJWT, validateSchool, createSchool);
router.put("/:id", adminAuthJWT, validateUpdateSchool, updateSchool);
router.delete("/:id", adminAuthJWT, deleteSchool);

export default router;
