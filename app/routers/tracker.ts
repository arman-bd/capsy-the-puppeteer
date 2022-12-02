// Router
import { Router } from "express";
const TrackerRouter: Router = Router();

// Controller
import TrackerController from "../controllers/tracker";
const trackerController = new TrackerController();

// CARU
TrackerRouter.get(
  "/caru",
  trackerController.track_caru.bind(trackerController)
);

// MAERSK
TrackerRouter.get(
  "/evergreen",
  trackerController.track_evergreen.bind(trackerController)
)

// Export
export default TrackerRouter;
