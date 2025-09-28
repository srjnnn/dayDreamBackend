import { login } from "../../../controllers/auth/login.js";
import { Router } from "express";
class loginRoute {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }
    
    initializeRoutes() {
        this.router.post("/", login);
    }
}   
export default loginRoute;