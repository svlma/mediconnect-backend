import express from "express";
import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
  getDoctorsByLocation, // Import the new controller function
} from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

// Nested route
router.use("/:id/reviews", reviewRouter);

router.get("/:id", getSingleDoctor);
router.get("/", getAllDoctor);
router.get("/location", getDoctorsByLocation); // Add the new route for location search
router.put("/:id", authenticate, restrict(["doctor", "admin"]), updateDoctor);
router.delete(
  "/:id",
  authenticate,
  restrict(["doctor", "admin"]),
  deleteDoctor
);
router.get(
  "/profile/me",
  authenticate,
  restrict(["doctor", "admin"]),
  getDoctorProfile
);

export default router;
