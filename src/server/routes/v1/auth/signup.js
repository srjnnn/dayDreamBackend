import { Router } from "express";
import { signup } from "../../../controllers/auth/signup.js";
import { verifyOtp } from "../../../controllers/auth/validate.js";
class signupRoute{
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.post("/", signup);
        this.router.post("/validate",verifyOtp)
    }
}
export default signupRoute