import { resetPassword } from "../../../controllers/auth/verifyReset.js";
import { requestPasswordReset } from "../../../controllers/auth/reset.js";
import { Router } from "express";

class resetRoute {
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/request", requestPasswordReset);
    this.router.post("/verify", resetPassword);
  }
}

export default resetRoute;