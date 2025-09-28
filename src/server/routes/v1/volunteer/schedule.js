import { Router } from "express";
import { getUncategorizedUsers, scheduleUser } from "../../../controllers/volunteer/schedule.js";

class volunteerRoute {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Fetch users whose category is null
        this.router.get("/uncategorized", getUncategorizedUsers);

        // Schedule a user manually
        this.router.post("/scheduleUser", scheduleUser);
    }
}

export default volunteerRoute;
