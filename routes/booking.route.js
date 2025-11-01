import express from "express";
import { getAllBookings, getUserBookings, updateBookingStatus } from "../controller/booking.controller";
const router = express.Router()

router.get("/", getAllBookings);
router.get("/:id", getUserBookings);
router.put("/:id/status", updateBookingStatus);


export default router