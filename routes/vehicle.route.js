import express from "express";
import upload from "../middleware/multer";
import { createVehicle, getAllVehicle, getVehicleById } from "../controller/vehicle.controller";

const router = express.Router()

router.get("/", getAllVehicle)
router.get("/:id", getVehicleById);


router.post(
  "/add-car",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createVehicle
);


export default router

