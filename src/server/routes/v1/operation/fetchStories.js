import { Router } from "express";
import { getAllStories } from "../../../controllers/operation/fetchStories.js";


class fetchStoriesRoute {
    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }           

    initializeRoutes() {
        // Fetch events for a user
        this.router.get("/", getAllStories);      
    }           
}

export default fetchStoriesRoute;