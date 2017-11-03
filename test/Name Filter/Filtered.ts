process.env.ALLOWED_USERS = 'X,y, Z';

import {Controller, ControllerLoader, GET, RouteMiddleware} from "express-decorated-router/dist";
import {allowedUsers} from "../../src/middleware/name-filter";
import test from 'ava';
import * as express from 'express';
import {Request, Response} from 'express';
import * as request from 'supertest';

const app = express();

@Controller('/')
class Ctrl {

  @GET('/fetch/:user')
  @RouteMiddleware(allowedUsers)
  static f(req: Request, res: Response) {
    res.end('ok');
  }

  @GET('/')
  @RouteMiddleware(allowedUsers)
  static nf(req: Request, res: Response) {
    res.end('ok');
  }
}

new ControllerLoader(app).loadController(Ctrl);

for (const u of ['x', 'Y', 'z']) {
  test(`Allow ${u}`, t => {
    return request(app)
      .get(`/fetch/${u}`)
      .expect(200)
      .then(() => t.pass())
      .catch((e: Error) => t.fail(e.message));
  });
}

test("Disallow", t => {
  return request(app)
    .get('/fetch/a')
    .expect(403, 'User a not allowed.')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("No user", t => {
  return request(app)
    .get('/')
    .expect(400, 'Could not determine username')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});