process.env.ALLOWED_USERS = 'X,y, Z';
import {test} from 'ava';
import * as express from 'express';
import {Request, Response} from 'express'; // tslint:disable-line:no-duplicate-imports
import {Controller, ControllerLoader, GET, RouteMiddleware} from 'express-decorated-router/dist';
import * as request from 'supertest';
import {allowedUsers} from '../../src/middleware/name-filter';
import {StatusCode} from '../../src/utils/StatusCode';

const app = express();

@Controller('/')
class Ctrl {

  @GET('/fetch/:user')
  @RouteMiddleware(allowedUsers)
  public static f(req: Request, res: Response) {
    res.end('ok');
  }

  @GET('/')
  @RouteMiddleware(allowedUsers)
  public static nf(req: Request, res: Response) {
    res.end('ok');
  }
}

new ControllerLoader(app).loadController(Ctrl);

for (const u of ['x', 'Y', 'z']) {
  test(`Allow ${u}`, t => {
    return request(app)
      .get(`/fetch/${u}`)
      .expect(StatusCode.OK)
      .then(() => t.pass())
      .catch((e: Error) => t.fail(e.message));
  });
}

test('Disallow', t => {
  return request(app)
    .get('/fetch/a')
    .expect(StatusCode.FORBIDDEN, 'User a not allowed.')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});

test('No user', t => {
  return request(app)
    .get('/')
    .expect(StatusCode.BAD_REQUEST, 'Could not determine username')
    .then(() => t.pass())
    .catch((e: Error) => t.fail(e.message));
});
