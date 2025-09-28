import { Router } from 'express';
import signupRoute from './auth/signup.js';
import loginRoute from './auth/login.js';
import resetRoute from './auth/reset.js'
import volunteerRoute from './volunteer/schedule.js';
import fetchEventsRoute from './operation/fetchEvents.js';
import fetchStoriesRoute from './operation/fetchStories.js';

export default class V1Route {
    constructor() {
        this.router = Router({ mergeParams: true });
        this.signupRoute = new signupRoute();
        this.loginRoute = new loginRoute();
        this.resetRoute = new resetRoute();
        this.volunteerRoute = new volunteerRoute();
        this.fetchEventsRoute = new fetchEventsRoute();
        this.fetchStoriesRoute = new fetchStoriesRoute();
        
        this.setupRoutes();
    }
      setupRoutes() {
        // initialize routes here
        this.router.use('/signup', this.signupRoute.router);
        this.router.use('/login', this.loginRoute.router);
        this.router.use('/reset', this.resetRoute.router);
        this.router.use('/volunteer', this.volunteerRoute.router);
        this.router.use('/events', this.fetchEventsRoute.router);
        this.router.use('/stories', this.fetchStoriesRoute.router);
        
    }
}