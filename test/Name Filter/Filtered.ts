process.env.ALLOWED_USERS = 'X,y, Z';
import {test} from 'ava';
import * as e from 'express';
import {Controller, ExpressDecoratedRouter, GET, RouteMiddleware} from 'express-decorated-router';
import * as request from 'supertest';
import {allowedUsers} from '../../src/middleware/name-filter';
import {StatusCode} from '../../src/utils/StatusCode';

const app = e();

@Controller('/')
export class Ctrl {

  @GET('/fetch/:user')
  @RouteMiddleware(allowedUsers)
  public static f(req: e.Request, res: e.Response) {
    res.end('ok');
  }

  @GET('/')
  @RouteMiddleware(allowedUsers)
  public static nf(req: e.Request, res: e.Response) {
    res.end('ok');
  }
}

ExpressDecoratedRouter.applyRoutes(app).reset();

for (const u of ['x', 'Y', 'z']) {
  test(`Allow ${u}`, t => {
    return request(app)
      .get(`/fetch/${u}`)
      .expect(StatusCode.OK)
      .then(() => t.pass())
      .catch((err: Error) => t.fail(err.message));
  });
}

test('Disallow', t => {
  return request(app)
    .get('/fetch/a')
    .expect(StatusCode.FORBIDDEN, 'User a not allowed.')
    .then(() => t.pass())
    .catch((err: Error) => t.fail(err.message));
});

test('No user', t => {
  return request(app)
    .get('/')
    .expect(StatusCode.BAD_REQUEST, 'Could not determine username')
    .then(() => t.pass())
    .catch((err: Error) => t.fail(err.message));
});
