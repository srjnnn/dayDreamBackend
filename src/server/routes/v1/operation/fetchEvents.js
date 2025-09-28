import { Router } from "express";
import { getUserEvents } from "../../../controllers/operation/fetchEvents.js";


class fetchEventsRoute {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }           

    initializeRoutes() {
        // Fetch events for a user
        this.router.get("/", getUserEvents);      
    }           
}

export default fetchEventsRoute;