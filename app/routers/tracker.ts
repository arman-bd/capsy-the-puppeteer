// Router
import { Router } from "express";
const TrackerRouter: Router = Router();

// Controller
import TrackerController from "../controllers/tracker";
const trackerController = new TrackerController();

// Routes
TrackerRouter.get(
  "/caru",
  trackerController.track_caru.bind(trackerController)
);

// Export
export default TrackerRouter;
