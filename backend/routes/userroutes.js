import express from "express";
import { getProfile } from "../controller/usercontroller.js";

const route = express.Router();    


route.get("/profile",getProfile);
export default route;