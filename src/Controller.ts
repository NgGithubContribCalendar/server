import {Controller, ControllerMiddleware, GET, RouteMiddleware} from "express-decorated-router/dist";
import {Request, Response} from "express";
import {Cache} from "./utils/Cache";
import {allowedUsers} from "./middleware/name-filter";
import {originFilter} from "./middleware/origin-filter";
import {Parser} from "./utils/Parser";
import {stdHeaders} from "./middleware/stdHeaders";
import {IParsedPayload} from "@ng-github-contrib-calendar/common-types";
import {fetchHTML} from "./utils/Fetcher";

const shrinky = require('shrink-ray')({
  threshold: 1,
  zlib: {
    level: 9
  },
  brotli: {
    quality: 11
  }
});

const toRegex = /^\d{4}-\d{2}-\d{2}$/;

@Controller('/')
@ControllerMiddleware(shrinky, stdHeaders)
export class RootController {

  @GET('/')
  static index(req: Request, res: Response) {
    res.redirect('https://github.com/NgGithubContribCalendar/server');
  }

  @GET('/fetch/:user')
  @RouteMiddleware(originFilter, allowedUsers)
  static load(req: Request, res: Response) {
    const to: string = req.query.to;

    if (to && (typeof to !== 'string' || !toRegex.test(to))) {
      return res.status(400).end(`to must be a string matching the regex ${toRegex}`);
    }

    const user: string = req.params.user;

    Cache.getItem(user, to)
      .then(async cachedItem => {
        if (cachedItem) {
          res.header('X-cached', '1');
          return cachedItem;
        } else {
          res.header('X-cached', '0');

          const data = await fetchHTML(user, to);

          const parser = new Parser(data).toJSON();
          Cache.setItem(parser, user, to).catch(console.error);

          return parser;
        }
      })
      .then((data: IParsedPayload) => {
        res.json(data);
      })
      .catch(e => {
        res.status(500).end(e.message || e);
      });
  }

  @GET('/ping')
  static ping(req: Request, res: Response) {
    res.end('pong');
  }
}