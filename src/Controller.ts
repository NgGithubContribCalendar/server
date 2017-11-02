import {Controller, ControllerMiddleware, GET, RouteMiddleware} from "express-decorated-router/dist";
import {Request, Response} from "express";
import {Cache} from "./Cache";
import * as request from 'request';
import {allowedUsers} from "./name-filter";
import {originFilter} from "./origin-filter";
import {IParsedPayload} from "./entities/IParsedPayload";
import {Parser} from "./Parser";
import {stdHeaders} from "./stdHeaders";

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

  private static constructURL(user: string, to?: string): string {
    let url = `https://github.com/users/${user}/contributions`;

    if (to) {
      url += `?to=${to}`;
    }

    return url;
  }

  @GET('/')
  static index(req: Request, res: Response) {
    res.redirect('https://github.com/Alorel/github-contrib-calendar-parser');
  }

  @GET('/:user')
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

          const data = await new Promise<string>((resolve, reject) => {
            const url = RootController.constructURL(user, to);

            request.get(url, (err: any, rsp: any, data: string) => {
              if (err) {
                reject(err);
              } else if (!data) {
                reject(new Error('no body'));
              } else {
                resolve(data);
              }
            });
          });

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