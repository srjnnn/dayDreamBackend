import { Router } from 'express';
import signupRoute from './auth/signup.js';
import loginRoute from './auth/login.js';
import resetRoute from './auth/reset.js'

export default class V1Route {
    constructor() {
        this.router = Router({ mergeParams: true });
        this.signupRoute = new signupRoute();
        this.loginRoute = new loginRoute();
        this.resetRoute = new resetRoute();
        
        this.setupRoutes();
    }
      setupRoutes() {
        // initialize routes here
        this.router.use('/signup', this.signupRoute.router);
        this.router.use('/login', this.loginRoute.router);
        this.router.use('/reset', this.resetRoute.router);
        
    }
}