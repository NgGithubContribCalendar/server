process.env.ALLOWED_ORIGINS = 'loCaLhost,127.0.0.1, example.com';

import {originFilter} from "../../src/middleware/origin-filter";
import {Controller, ControllerLoader, GET, RouteMiddleware} from "express-decorated-router/dist";
import test from 'ava';
import * as express from 'express';
import {Request, Response} from 'express';
import * as request from 'supertest';

const app = express();

@Controller('/')
class Ctrl {

  @GET('/')
  @RouteMiddleware(originFilter)
  static f(req: Request, res: Response) {
    res.end('ok');
  }
}

new ControllerLoader(app).loadController(Ctrl);

for (const o of ['localhost', '127.0.0.1', 'example.com']) {
  test(`Allow ${o}`, t => {
    return request(app)
      .get('/')
      .set('Origin', `http://${o}`)
      .expect(200)
      .expect('Access-Control-Allow-Origin', '*')
      .then(() => t.pass())
      .catch((e: Error) => t.fail(e.message));
  });
}

test("Disallow", t => {
  return request(app)
    .get('/')
    .set('Origin', 'http://foo.bar')
    .expect(403, 'Origin foo.bar not allowed.')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("Invalid origin", t => {
  return request(app)
    .get('/')
    .set('Origin', 'foo.bar')
    .expect(500)
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test("No origin", t => {
  return request(app)
    .get('/')
    .expect(403, 'Could not determine origin')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});