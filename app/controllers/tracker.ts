import { Request, Response } from "express";
import TrackerService from "../services/tracker";

export default class TrackerController {
  public async track_caru(req: Request, res: Response) {
    // Get ID from request
    const id = req.query.id ? req.query.id.toString() : null;

    // Get HTML from Tracker Service
    const html = (await new TrackerService().track_caru(id)) ?? null;

    // Send HTML
    res.send(html);
  }
}
