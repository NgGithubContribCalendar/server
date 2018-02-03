import {IParsedPayload} from '@ng-github-contrib-calendar/common-types';
import {Request, Response} from 'express';
import {Controller, ControllerMiddleware, GET, RouteMiddleware} from 'express-decorated-router';
import shrinkRay = require('shrink-ray-current');
import {allowedUsers} from './middleware/name-filter';
import {originFilter} from './middleware/origin-filter';
import {stdHeaders} from './middleware/stdHeaders';
import {Cache} from './utils/Cache';
import {fetchHTML} from './utils/Fetcher';
import {Parser} from './utils/Parser';
import {StatusCode} from './utils/StatusCode';

const shrinky = shrinkRay({
  brotli: {
    quality: 11
  },
  threshold: 1,
  zlib: {
    level: 9
  }
});

const toRegex = /^\d{4}-\d{2}-\d{2}$/;

@Controller('/')
@ControllerMiddleware(shrinky, stdHeaders)
export class RootController {

  @GET('/')
  public static index(req: Request, res: Response) {
    res.redirect('https://github.com/NgGithubContribCalendar/server');
  }

  @GET('/fetch/:user')
  @RouteMiddleware(originFilter, allowedUsers)
  public static load(req: Request, res: Response) {
    const to: string = req.query.to;

    if (to && (typeof to !== 'string' || !toRegex.test(to))) {
      res.status(StatusCode.BAD_REQUEST).end(`to must be a string matching the regex ${toRegex}`);

      return;
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
          // tslint:disable-next-line:no-unbound-method
          Cache.setItem(parser, user, to).catch(console.error);

          return parser;
        }
      })
      .then((data: IParsedPayload) => {
        res.json(data);
      })
      .catch((e: any) => {
        res.status(StatusCode.SERVER_ERROR).end(e.message || e);
      });
  }

  @GET('/ping')
  public static ping(req: Request, res: Response) {
    res.end('pong');
  }
}
