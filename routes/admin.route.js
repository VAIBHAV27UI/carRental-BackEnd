import express from 'express'
import { login, signup } from "../controller/admin.controller"


const router = express.Router()

router.post("/create-admin", signup)
router.post("/login", login)

export default router



