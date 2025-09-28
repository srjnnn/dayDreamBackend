import { Router } from "express";
import { getUncategorizedUsers, scheduleUser } from "../../../controllers/volunteer/schedule.js";
import { setCategory } from "../../../controllers/volunteer/setCategory.js";

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

        // Set category for a user
        this.router.post("/setCategory", setCategory);
    }
}

export default volunteerRoute;
