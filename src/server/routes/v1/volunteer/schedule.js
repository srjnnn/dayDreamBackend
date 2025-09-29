import { Router } from "express";
import { autoScheduleUser } from "../../../controllers/volunteer/schedule.js";
import { setCategory } from "../../../controllers/volunteer/setCategory.js";
import { getScheduledUsers } from "../../../controllers/volunteer/getSchedule.js";

class volunteerRoute {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Fetch users whose category is null
        // this.router.get("/uncategorized", getUncategorizedUsers);

        // Schedule a user manually
        this.router.post("/scheduleUser", autoScheduleUser);

        // Set category for a user
        this.router.post("/setCategory", setCategory);

        // get scheduled users
        this.router.get("/scheduledUsers", getScheduledUsers);       
    }
}

export default volunteerRoute;
