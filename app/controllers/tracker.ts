import { Request, Response } from "express";
import TrackerService from "../services/tracker";

export default class TrackerController {

  /**
   * Track CARU Containers
   * @param req Request
   * @param res Response
   * @returns HTML of Container Details
   */
  public async track_caru(req: Request, res: Response) {
    // Get ID from request
    const id = req.query.id ? req.query.id.toString() : null;

    // Get HTML from Tracker Service
    try {
      const html = (await new TrackerService().track_caru(id)) ?? null;

      // If HTML is not null then transform it
      if (html) {
        // Get Transformer
        const transformer = await import(`../transformer/evergreen`);
        const transformed = new transformer.default().transform(html);
        res.send(transformed);
      } else {
        res.send(html);
      }
    } catch (e) {
      console.log(e);
      return res.send(e);
    }
  }

  /**
   * Track Evergreen Containers
   * @param req Request
   * @param res Response
   * @returns HTML of Container Details
   */
  public async track_evergreen(req: Request, res: Response) {
    // Get ID from request
    const id = req.query.id ? req.query.id.toString() : null;

    // Get HTML from Tracker Service
    try {
      const html = (await new TrackerService().track_evergreen(id)) ?? null;

      // If HTML is not null then transform it
      if (html !== null) {
        // Get Transformer
        const transformer = await import(`../transformer/evergreen`);
        const transformed = await new transformer.default().transform(html);
        res.send(transformed);
      } else {
        res.send(html);
      }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  }

  /**
   * Track OOCL Containers
   * @param req Request
   * @param res Response
   * @returns HTML of Container Details
   * @example
   * curl -X GET "http://localhost:3000/tracker/oocl?id=OOLU1234567"
   */
  public async track_oocl(req: Request, res: Response) {
    // Get ID from request
    const id = req.query.id ? req.query.id.toString() : null;

    // Get HTML from Tracker Service
    try {
      const html = (await new TrackerService().track_oocl(id)) ?? null;

      // If HTML is not null then transform it
      if (html !== null) {
        // Get Transformer
        const transformer = await import(`../transformer/oocl`);
        const transformed = await new transformer.default().transform(html);
        res.send(transformed);
      } else {
        res.send(html);
      }
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  }
}
